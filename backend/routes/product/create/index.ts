import { FastifyInstance, FastifyPluginAsync, FastifyError } from 'fastify';
import fp from 'fastify-plugin';
import { z, ZodError } from 'zod';
import path from 'node:path';
import fs from 'node:fs';
import { Readable } from 'node:stream';
import {
    validatorCompiler,
    serializerCompiler,
    ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { Response } from '@schema/http';
import createError from '@fastify/error';

const createZodMultipart = <T extends z.ZodTypeAny>(value: T) => {
    return z.object({
        value: value,
        mimetype: z.enum(['text/plain']),
    });
};

const createZodMultipartFile = () => {
    return z.object({
        file: z.instanceof(Readable),
        filename: z.string(),
        value: z.instanceof(Buffer),
        mimetype: z.enum(['image/png', 'image/jpg']),
    });
};
const body = z.object({
    description: createZodMultipart(z.string()),
    name: createZodMultipart(z.string()),
    price: createZodMultipart(z.coerce.number()),
    category: createZodMultipart(z.string()),
    img: createZodMultipartFile(),
    stock: createZodMultipart(z.coerce.number()),
});
async function register(server: FastifyInstance) {
    const nanoid = (await import('nanoid')).nanoid;
    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);

    const route = server.withTypeProvider<ZodTypeProvider>();
    const error = {
        categoryNotFound: createError(
            'ERR_CATEGORY_NOT_FOUND',
            '%s',
            404,
            TypeError
        ),
    };

    route.setErrorHandler<
        FastifyError,
        {
            Reply: Response<{ error: ZodError | FastifyError }>;
        }
    >((error, _, res) => {
        if (error instanceof ZodError) {
            res.status(400).send({
                data: null,
                error: JSON.parse(error.message) as ZodError,
                code: 'ERROR_VALIDATION',
                message: 'Validation error',
                success: false,
            });
            return;
        }
        type statusCode = Parameters<(typeof res)['status']>[0];

        if (error instanceof TypeError) {
            res.status((error.statusCode as statusCode) ?? 400).send({
                data: null,
                code: error.code,
                message: error.message,
                success: false,
            });
        }

        res.status(422).send({
            data: null,
            code: 'ERROR_GENERIC',
            message: 'Uncaugh Error',
            error: error,
            success: false,
        });
    });
    route.addHook<{ Body: z.infer<typeof body> }>('preHandler', async (req) => {
        const category = await server.prisma.productCategory.findFirst({
            where: {
                name: req.body.category.value,
            },
        });

        if (!category) {
            throw error.categoryNotFound(
                `${req.body.category.value} not found`
            );
        }
    });
    route.post<{
        Body: z.infer<typeof body>;
    }>(
        '/product/create',
        {
            schema: {
                body: body,
            },
        },
        async (req, res) => {
            const img = req.body.img;
            const extension = img.mimetype.split('/')[1];
            const writeStream = fs.createWriteStream(
                path.join(
                    process.cwd(),
                    'storage/img',
                    `${nanoid()}.${extension}`
                )
            );
            const read = Readable.from(img.value);
            read.pipe(writeStream).addListener('error', (err) => {
                console.log(err);
            });
            const body = req.body;
            await server.prisma.product.create({
                data: {
                    productInformation: {
                        create: {
                            price: body.price.value,
                            description: body.description.value,
                            name: body.name.value,
                            stock: body.stock.value,
                        },
                    },
                    productCategory: body.category.value,
                },
            });
            res.status(204).send();

            return;
        }
    );
}
const cb: FastifyPluginAsync = async (server) => {
    server.register(register);
};

// export default fp(cb);
export default fp(cb);
