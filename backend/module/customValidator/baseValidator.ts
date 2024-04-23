import z, { ZodError, ZodIssueBase } from 'zod';
import { FastifyInstance } from 'fastify';
// type test<F> = F extends (...args: any[]) => infer R extends ZodIssueBase ? true: false
export default class BaseValidator<T> {
    value?: T;
    type?: T;
    #server: FastifyInstance;
    _fnList: ((...args: any[]) => ZodIssueBase | void)[] = [];
    constructor(server: FastifyInstance) {
        // this.#value = value;
        this.#server = server;
    }

    parse(value: T) {
        this.value = value;
        this._fnList.forEach((fn) => {
            fn();
        });
    }
}
