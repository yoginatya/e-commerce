import { FastifyInstance } from 'fastify';
import z, { ZodError, ZodIssue } from 'zod';
import type { zodCtx, customValidatorOption } from './type';
import ValidatorError from './validatorError';
export default class BaseValidator {
    #server: FastifyInstance;
    ctx: zodCtx;
    #option: customValidatorOption;
    #issue: ZodIssue[] = [];
    protected _callFn: (
        | ((ctx: zodCtx) => void | never)
        | ((ctx: zodCtx) => Promise<void> | never)
    )[] = [];
    constructor(
        ctx: zodCtx,
        option: customValidatorOption,
        server: FastifyInstance
    ) {
        this.ctx = ctx;
        this.#server = server;
        this.#option = option;
    }

    async validate() {
        for (let i = 0; i < this._callFn.length; i++) {
            try {
                await this._callFn[i](this.ctx);
            } catch (e) {
                if (!(e instanceof ValidatorError)) {
                    throw e;
                }
                this.#addIssue(e.issue);
                if (this.#option['abortOnFirstError']) {
                    return this.#issue;
                }
            }
        }
    }
    #addIssue(issue: z.IssueData) {
        this.ctx.addIssue(issue);
    }
}
