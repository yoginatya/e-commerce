import fp from 'fastify-plugin';
import z from 'zod';
import type { zodCtx } from '@module/zodCustomValidator/type';
import validator from '@module/zodCustomValidator';

// declare function validator(
//     value: z.ZodString
// ): InstanceType<typeof StringValidator>;
// declare function validator(
//     value: z.ZodTypeAny
// ): InstanceType<typeof BaseValidator>;

declare module 'fastify' {
    interface FastifyInstance {
        zodCustomValidator: ReturnType<typeof validator>;
    }
}
export default fp((server, _, done) => {
    server.decorate('zodCustomValidator', validator(server));

    done();
});
