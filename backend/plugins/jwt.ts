import fastifyJwt, { FastifyJWTOptions } from '@fastify/jwt';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import fp from 'fastify-plugin';

type userData = {
    id: number;
    name: string;
};

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (req: FastifyRequest) => Promise<void>;
    }
    interface FastifyReply {
        refreshJwtSign: FastifyReply['jwtSign'];
        createToken: (data: userData) => Promise<{
            accessToken: string;
            refreshToken: string;
        }>;
    }
    interface FastifyRequest {
        // Custom namespace
        refreshJwtVerify: FastifyRequest['jwtVerify'];
        refreshJwtDecode: FastifyRequest['jwtDecode'];
    }
}

export default fp(async (server: FastifyInstance) => {
    server.register(fastifyJwt, {
        secret: 'THIS ACCESS TOKEN NEED TO CHANGED LATER',
    } as FastifyJWTOptions);

    server.register(fastifyJwt, {
        secret: 'THIS REFRESH TOKEN NEED TO CHANGED LATER',
        namespace: 'refresh',
        cookie: {
            signed: true,
            cookieName: 'refresh',
        },
    } as FastifyJWTOptions);

    server.decorateReply('createToken', async function (user: userData) {
        const access = server.jwt.sign({ data: user }, { expiresIn: '5m' });
        const reply: FastifyReply = this;
        const refresh = await reply.refreshJwtSign(
            { data: user },
            { expiresIn: '7d' }
        );
        await server.prisma.token.create({
            data: {
                token: refresh,
                userId: user.id,
            },
        });

        return {
            accessToken: access,
            refreshToken: refresh,
        };
    });

    server.decorate('authenticate', async function (req: FastifyRequest) {
        const test = await req.jwtVerify();
        console.log(test);
    });
});
