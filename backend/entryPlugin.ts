import { FastifyInstance } from 'fastify';
import path from 'path';
import autoload from '@fastify/autoload';
import fp from 'fastify-plugin';
export default fp(async function (server: FastifyInstance) {
    // server.addHook('onRoute', (requestOption) => {
    //     let method: string;

    //     if (requestOption.method instanceof Array) {
    //         method = requestOption.method.join(',');
    //     } else {
    //         method = requestOption.method;
    //     }

    //     console.log(`${requestOption.url} (${method})`);
    // });
    server.register(autoload, {
        dir: path.join(__dirname, 'plugins'),
    });
    server.register(autoload, {
        dir: path.join(__dirname, 'routes'),
    });
});
