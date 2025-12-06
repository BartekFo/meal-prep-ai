import { z } from 'zod';

export const essentialInfoSchema = z.object({
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	allergies: z.string(),
	weightGoal: z.enum(['lose', 'maintain', 'gain']),
	dateOfBirth: z.string().min(1),
	gender: z.string().min(1),
	activityLevel: z.string().min(1),
	currentWeight: z.number().min(0),
	height: z.number().min(0)
});

export type EssentialInfo = z.infer<typeof essentialInfoSchema>;
