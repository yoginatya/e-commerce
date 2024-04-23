import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

export default fp(async (server: FastifyInstance) => {
    server.get('/', (_, reply) => {
        return reply.notFound();
    });
});
