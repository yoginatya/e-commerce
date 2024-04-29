import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import z from 'zod';
import {
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider,
} from 'fastify-type-provider-zod';
async function register(server: FastifyInstance) {
    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);
    const route = server.withTypeProvider<ZodTypeProvider>();
    const queryStringSchema = z.object({
        count: z.number().max(20),
        lastId: z.number().optional(),
    });

    route.addHook('onRequest', route.authenticate);
    route.addHook<{ Querystring: z.infer<typeof queryStringSchema> }>(
        'preValidation',
        (req, _, done) => {
            const value = req.query;
            //check if NaN
            value.count = parseInt(value.count.toString(), 10) || value.count;
            value.lastId = value.lastId
                ? undefined
                : parseInt(value.count.toString(), 10) || value.lastId;

            done();
        }
    );
    route.get<{ Querystring: z.infer<typeof queryStringSchema> }>(
        '/product',
        {
            schema: {
                querystring: queryStringSchema,
            },
        },
        async (req, res) => {
            const products = await server.prisma.product.findMany({
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
                },

                take: req.query.count,
            });
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
                    },
                }),
                'productId'
            );
            type UnwrapArray<A> = A extends unknown[]
                ? UnwrapArray<A[number]>
                : A;
            type Result = UnwrapArray<typeof products> & {
                rating: number | null;
            };
            const result: Result[] = products.map((product) => {
                return {
                    ...product,
                    rating: review[product.id as keyof typeof review]['_avg'][
                        'rating'
                    ],
                };
            });

            return res.send({
                data: result,
            });
        }
    );
}
const callback: FastifyPluginAsync = async (server) => {
    await server.register(register);
};
export default fp(callback);
