import { FastifyInstance, FastifyPluginAsync, FastifyError } from 'fastify';
import fp from 'fastify-plugin';
import z, { ZodIssue } from 'zod';
import {
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { CreateResponseSchema, Response } from '@schema/http';

async function register(server: FastifyInstance) {
    const searchResponse = CreateResponseSchema(
        z.array(
            z.object({
                productCategory: z.string(),
                id: z.number(),
                productInformation: z
                    .object({
                        description: z.string(),
                        name: z.string(),
                        price: z.number(),
                    })
                    .nullable(),
                rating: z.number(),
            })
        )
    );
    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);
    const route = server.withTypeProvider<ZodTypeProvider>();
    const queryStringSchema = z.object({
        count: z.number().max(20),
        lastId: z.number().optional().nullable(),
    });
    route.setErrorHandler<
        FastifyError,
        {
            Reply: Response<{ error: ZodIssue | FastifyError }>;
        }
    >((error, _, res) => {
        let errorMessage: ZodIssue | FastifyError;
        try {
            errorMessage = JSON.parse(error.message) as ZodIssue;
        } catch (err) {
            errorMessage = error;
        }
        res.status(400).send({
            data: null,
            error: errorMessage,
            code: 'ERR_VALIDATION',
            message: 'Validation error',
            success: false,
        });
    });
    route.addHook<{ Querystring: z.infer<typeof queryStringSchema> }>(
        'preValidation',
        (req, _, done) => {
            const value = Object.assign({}, req.query);

            //check if NaN
            value.count = parseInt(value.count.toString(), 10) || value.count;
            value.lastId = value.lastId
                ? undefined
                : parseInt(value.count.toString(), 10) || value.lastId;
            req.query = value;
            done();
        }
    );
    route.get<{
        Querystring: z.infer<typeof queryStringSchema>;
        Reply: z.infer<typeof searchResponse>;
    }>(
        '/product',
        {
            exposeHeadRoute: false,
            schema: {
                querystring: queryStringSchema,
                response: {
                    '2xx': searchResponse,
                },
            },
        },
        async (req, res) => {
            const products =
                (await server.prisma.product.findMany({
                    select: {
                        productCategory: true,
                        id: true,
                        productInformation: {
                            select: {
                                price: true,
                                name: true,
                                description: true,
                            },
                        },
                    },
                    where: {
                        id: {
                            gt: req.query.lastId ?? -1,
                        },
                        productCategory: {
                            not: null,
                        },
                    },

                    take: req.query.count,
                })) ?? [];
            const review = server.util.transformArrayObject(
                await server.prisma.review.groupBy({
                    by: ['productId'],
                    _avg: {
                        rating: true,
                    },
                    where: {
                        productId: {
                            in: products.map((product) => product.id),
                        },
                        product: {
                            productCategory: {
                                not: null,
                            },
                        },
                    },
                }),
                'productId'
            );
            type UnwrapArray<A> = A extends unknown[]
                ? UnwrapArray<A[number]>
                : A;

            type NoUndefinedField<T> = {
                [P in keyof T]-?: Exclude<T[P], null | undefined>;
            };

            type Result = NoUndefinedField<UnwrapArray<typeof products>> & {
                rating: number;
            };
            const result: Result[] = products.map((product) => {
                const rating =
                    review[product.id as keyof typeof review]['_avg']['rating'];
                return {
                    ...product,
                    rating: rating ?? 0,
                };
            }) as Result[];

            res.code(200).send({
                message: 'success retrieve data',
                error: null,
                data: result,
                success: true,
            });

            return res;
        }
    );
}
const callback: FastifyPluginAsync = async (server) => {
    await server.register(register);
};
export default fp(callback);
