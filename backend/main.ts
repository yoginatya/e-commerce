import 'dotenv/config';
import autoload from '@fastify/autoload';
import fastify from 'fastify';
import entryPlugin from './entryPlugin';
import path from 'path';

const fastifyPrintRoutes = import('fastify-print-routes');
const server = fastify({
    // logger: {
    //     file: './log/log.txt',
    // },
});
server.register(fastifyPrintRoutes);

server.register(entryPlugin);
server.listen({ port: 3000 }, (err, addres) => {
    if (err) {
        console.error(err);
    }

    console.log('server log at + ', addres);
});
