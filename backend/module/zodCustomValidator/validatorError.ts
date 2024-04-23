import type { z } from 'zod';
export default class ValidatorError {
    issue: z.IssueData;
    constructor(issue: z.IssueData) {
        this.issue = issue;
    }
}
