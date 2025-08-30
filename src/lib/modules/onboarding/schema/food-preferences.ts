import { type } from 'arktype';

export const foodPreferencesSchema = type({
  dietaryType: '"omnivore"|"vegetarian"|"vegan"|"lactose-intolerant"',
  dislikedFoods: 'string',
  preferredMealTypes: 'string[]>0',
});

export type FoodPreferences = typeof foodPreferencesSchema.infer;
