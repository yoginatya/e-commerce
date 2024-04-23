import z, { ZodError } from 'zod';
import { FastifyInstance } from 'fastify';
import BaseValidator from './baseValidator';
import type { Prisma, PrismaClient } from '@prisma/client';
import type { zodCtx, customValidatorOption } from './type';
import ValidatorError from './validatorError';
type ModelNames = Prisma.ModelName;
type PrismaModel<T extends ModelNames> = Exclude<
    Awaited<ReturnType<PrismaClient[Uncapitalize<T>]['findUnique']>>,
    null
>;
type zodErrorParam = Parameters<z.ZodAny['refine']>[1];
export default class StringValidator extends BaseValidator {
    value: string;
    #server: FastifyInstance;
    constructor(
        val: string,
        ctx: zodCtx,
        option: customValidatorOption,
        server: FastifyInstance
    ) {
        super(ctx, option, server);
        this.value = val;
        this.#server = server;
    }

    unique<T extends Uncapitalize<ModelNames>>(
        table: T,
        field: keyof PrismaModel<Capitalize<T>> & string,
        error?: zodErrorParam
    ): typeof this {
        this._callFn.push(async () => {
            const server = this.#server;
            type castTable = 'user';
            //cast the table type to satisfy typescript
            const record = await server.prisma[table as castTable].findFirst({
                where: {
                    [field]: this.value,
                },
            });
            if (record) {
                throw new ValidatorError({
                    code: z.ZodIssueCode.custom,
                    message: `${field} already used`,
                });
            }
        });

        return this;
    }
}
