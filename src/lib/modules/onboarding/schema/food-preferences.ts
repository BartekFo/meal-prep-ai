import { type } from "arktype";

export const foodPreferencesSchema = type({
  dietaryType: '"omnivore"|"vegetarian"|"vegan"|"lactose-intolerant"',
  dislikedFoods: "string",
  preferredMealTypes: "string[]",
});

export type FoodPreferences = typeof foodPreferencesSchema.infer;
