import z from 'zod';
export type zodCtx = Parameters<Parameters<z.ZodAny['superRefine']>[0]>[1];
export type customValidatorOption = {
    abortOnFirstError?: boolean;
};
