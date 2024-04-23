import fastifyJwt from '@fastify/jwt';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

export default fp(async (server: FastifyInstance) => {
    server.register(fastifyJwt, {
        secret: 'THIS NEED TO CHANGED LATER',
    });
});
