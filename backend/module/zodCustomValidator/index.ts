import type { FastifyInstance } from 'fastify';
import type { zodCtx, customValidatorOption } from './type';
import StringValidator from './stringValidator';

export default function (server: FastifyInstance) {
    return {
        string(val: string, ctx: zodCtx, option: customValidatorOption = {}) {
            return new StringValidator(val, ctx, option, server);
        },
    };
}
