import fp from 'fastify-plugin';
import type { FastifyError, FastifyInstance } from 'fastify';
import { Response, CreateResponseSchema } from '@schema/http';
import bcrypt from 'bcrypt';
import z from 'zod';
import {
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider,
} from 'fastify-type-provider-zod';
async function register(server: FastifyInstance) {
    const createUserSchema = z.object({
        name: z
            .string()
            .max(10)
            .min(4)
            .regex(/^[_A-Za-z1-9]*$/, {
                message: 'username must only alpha numeric',
            }),
        email: z.string().email(),
        password: z.string(),
    });
    const createUserSchemaResponse = createUserSchema
        .omit({
            password: true,
        })
        .merge(
            z.object({
                token: z.string(),
                id: z.number(),
            })
        );

    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);
    server.withTypeProvider<ZodTypeProvider>().route<{
        Reply: Response<{
            data: z.infer<typeof createUserSchemaResponse>;
        }>;
        Body: z.infer<typeof createUserSchema>;
    }>({
        method: 'POST',
        url: '/user/signup',
        schema: {
            body: createUserSchema,
            response: {
                '2xx': CreateResponseSchema(createUserSchemaResponse),
            },
        },

        handler: async (req, res) => {
            const body = req.body;
            const result = await server.prisma.user.create({
                data: {
                    email: body.email,
                    name: body.name,
                    password: await bcrypt.hash(
                        body.password,
                        parseInt(process.env.BCRYPT_SALT as string)
                    ),
                },
            });
            res.code(200).send({
                success: true,
                data: {
                    ...server.util.excludeProperty(req.body, {
                        password: true,
                    }),
                    id: result.id,
                    token: server.jwt.sign(req.body),
                },
                error: null,
                message: 'success creating user',
            });
        },
    });
    server.addHook<{
        Body: z.infer<typeof createUserSchema>;
    }>('preHandler', async (request) => {
        const schema = z.object({
            email: z.string().superRefine(async (val, ctx) => {
                const customValidator = server.zodCustomValidator.string(
                    val,
                    ctx
                );

                customValidator.unique('user', 'email');
                await customValidator.validate();
            }),
        });
        const body = request.body;
        await schema.parseAsync(body);
    });
    server.setErrorHandler<
        FastifyError,
        { Reply: Response<{ error: string | FastifyError }> }
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
export default fp(async (server: FastifyInstance) => {
    await server.register(register);
});
