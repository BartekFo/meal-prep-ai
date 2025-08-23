import { type } from 'arktype';

export const essentialInfoSchema = type({
	firstName: 'string>0',
	lastName: 'string>0',
	allergies: 'string',
	weightGoal: '"lose"|"maintain"|"gain"'
});

export type EssentialInfo = typeof essentialInfoSchema.infer;
