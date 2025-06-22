import { type } from 'arktype';

export const dietaryPreferencesSchema = type({
  dietaryPreferences: 'string[]'
});

export type DietaryPreferences = typeof dietaryPreferencesSchema.infer; 
