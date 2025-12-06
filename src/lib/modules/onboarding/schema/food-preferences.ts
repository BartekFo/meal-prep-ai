import { z } from 'zod';

export const foodPreferencesSchema = z.object({
	dietaryType: z.enum(['omnivore', 'vegetarian', 'vegan', 'lactose-intolerant']),
	dislikedFoods: z.string(),
	preferredMealTypes: z.array(z.string())
});

export type FoodPreferences = z.infer<typeof foodPreferencesSchema>;
