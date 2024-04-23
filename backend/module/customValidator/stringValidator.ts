import z, { ZodIssueBase } from 'zod';
import { FastifyInstance } from 'fastify';
import BaseValidator from './baseValidator';
import type { Prisma, PrismaClient } from '@prisma/client';
import { Exact } from '@prisma/client/runtime/library';
import { server } from 'typescript';
import { ZodInvalidTypeIssue } from 'zod';

type ModelNames = Prisma.ModelName;
type PrismaModel<T extends ModelNames> = Exclude<
    Awaited<ReturnType<PrismaClient[Uncapitalize<T>]['findUnique']>>,
    null
>;

const issueCode = {
    database_error: 'database_error',
} as const;

interface dbIssue extends ZodIssueBase {
    code: typeof issueCode.database_error;
}

interface error {
    message: string;
}
export default class StringValidator extends BaseValidator<string> {
    #parentPath: string[];
    #server: FastifyInstance;
    constructor(
        // value: string,
        server: FastifyInstance,
        parentPath: string[] = []
    ) {
        super(server);
        this.#parentPath = parentPath;
        // this.value = value;
        this.#server = server;
        this.type = 'string';
    }

    unique<T extends Uncapitalize<ModelNames>>(
        table: T,
        field: keyof PrismaModel<Capitalize<T>>,
        error?: error
    ): typeof this {
        type fn = () => void | dbIssue;
        const fn: fn = () => {
            const value = this.value;
            const server = this.#server;
            type castTable = 'user';
            //cast the table type to satisfy typescript
            const record = server.prisma[table as castTable].findFirst({
                where: {
                    [field]: value,
                },
            });

            if (!record) {
                const issues: dbIssue = {
                    code: issueCode.database_error,
                    path: [...this.#parentPath],
                    message: error?.message ?? `${value} already used`,
                };
                throw issues;
            }

            // return true;
        };
        this._fnList.push(fn);
        return this;
    }
}
