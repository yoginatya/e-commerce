import { error } from 'console';
import z, { ZodType } from 'zod';

const baseResponseSchema = () => {
    return z.object({
        success: z.custom<true>(
            (val) => {
                return val === true;
            },
            {
                message: 'success must be true',
            }
        ),
        message: z.string(),
        error: z.custom<null>(
            (val) => {
                return val === null || val === undefined;
            },
            {
                message: 'error must be undefined or null',
            }
        ),
    });
};
export const CreateResponseSchema = <T extends z.ZodTypeAny>(data: T) => {
    return baseResponseSchema().extend({
        data: data,
    });
};

// const ResponseErrorSchema = <T extends z.ZodTypeAny>(error: T) => {
//     return z.object({
//         success: z.boolean(),
//         message: z.string(),
//         data: z.object({}).optional().nullish(),
//         error: error,
//     });
// };

export interface ResponseError<S> {
    success: false;
    error: S;
    message: string;
    data: null;
}

export interface Response<
    S extends {
        error?: unknown;
        data?: unknown;
    } = { error: {}; data: {} }
> {
    '2xx': z.infer<ReturnType<typeof baseResponseSchema>> & {
        data: S['data'];
    };
    204: never;
    '4xx': ResponseError<S['error']>;
}
