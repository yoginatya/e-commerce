import fp from 'fastify-plugin';
import { Response, CreateResponseSchema } from '@schema/http';
import z from 'zod';
import bcrypt from 'bcrypt';
import type { User } from '@prisma/client';
import {
    validatorCompiler,
    serializerCompiler,
    ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { FastifyError, FastifyInstance, FastifyPluginAsync } from 'fastify';
import createZodCustomError from '@module/createZodCustomError';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
const responseLoginSchema = loginSchema.omit({ password: true }).merge(
    z.object({
        name: z.string(),
        token: z.string(),
    })
);

async function register(server: FastifyInstance) {
    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);
    const route = server.withTypeProvider<ZodTypeProvider>();

    let user: User;
    route.addHook<{
        Reply: Response<{ data: z.infer<typeof responseLoginSchema> }>;
        Body: z.infer<typeof loginSchema>;
    }>('preHandler', async (req) => {
        user = (await server.prisma.user.findFirst({
            where: {
                email: req.body.email,
            },
        })) as User;

        if (
            !user ||
            !(await bcrypt.compare(req.body.password, user.password))
        ) {
            throw createZodCustomError({
                message: 'Invalid email or password',
            });
        }
    });
    route.post<{
        Reply: Response<{ data: z.infer<typeof responseLoginSchema> }>;
        Body: z.infer<typeof loginSchema>;
    }>(
        '/user/login',
        {
            schema: {
                body: loginSchema,
                response: {
                    '2xx': CreateResponseSchema(responseLoginSchema),
                },
            },
        },
        (req, res) => {
            res.status(200).send({
                message: 'Login success',
                error: null,
                success: true,
                data: {
                    ...req.body,
                    email: user.email,
                    name: user.name,
                    token: server.jwt.sign({
                        name: user.name,
                    }),
                },
            });
        }
    );
    route.setErrorHandler<
        FastifyError,
        {
            Reply: Response<{ error: string | FastifyError }>;
        }
    >((error, _, res) => {
        let errorMessage: string | FastifyError;
        try {
            errorMessage = JSON.parse(error.message ?? {}) as FastifyError;
        } catch (err) {
            errorMessage = error;
        }
        res.status(400).send({
            data: null,
            error: errorMessage,
            message: 'Validation error',
            success: false,
        });
    });
}
const pluginCb: FastifyPluginAsync = async (server) => {
    server.register(register);
};
export default fp(pluginCb);
