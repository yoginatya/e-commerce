import { FastifyInstance } from 'fastify';
import BaseValidator from './baseValidator';
import StringValidator from './stringValidator';

export default class ObjectValidator extends BaseValidator<{}> {
    constructor(server: FastifyInstance) {
        super(server);
    }

    parse() {}
}
