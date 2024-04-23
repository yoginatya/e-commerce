import { FastifyInstance } from 'fastify';
import StringValidator from './stringValidator';
// import BaseValidator from "./baseValidator";

export default function CustomValidator<T>(server: FastifyInstance) {
    return {
        string() {
            return new StringValidator(server);
        },
    };
}
