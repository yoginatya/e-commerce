import sensible from '@fastify/sensible';
import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

export default fp((server: FastifyInstance, _, done) => {
    server.register(sensible);
    done();
});
