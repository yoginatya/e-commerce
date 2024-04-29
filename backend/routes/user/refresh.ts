import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

async function register(server: FastifyInstance) {
    server.post('/auth/refresh', async () => {
        // const token: { id: number } = await req.refreshJwtVerify();
        // const refresh = await server.prisma.token.findFirst({
        //     where: {
        //         token: token,
        //         id: token.id,
        //     },
        // });
    });
}
const cb: FastifyPluginAsync = async (server) => {
    await server.register(register);
};

export default fp(cb);
