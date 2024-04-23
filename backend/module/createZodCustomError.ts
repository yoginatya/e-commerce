import { ZodIssueCode, type ZodCustomIssue } from 'zod';
export default function (issue: Partial<ZodCustomIssue>): ZodCustomIssue {
    const {
        code = ZodIssueCode.custom,
        path = [],
        message = '',
        params = {},
    } = issue;
    return { code, path, message, params };
}
