import 'dotenv/config';
import fastify from 'fastify';
import entryPlugin from './entryPlugin';

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
