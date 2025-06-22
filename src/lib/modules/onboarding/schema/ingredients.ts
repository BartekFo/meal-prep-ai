import { type } from 'arktype';

export const ingredientSchema = type('string>0');

export const dislikedIngredientsSchema = type({
  dislikedIngredients: 'string[]'
});

export type DislikedIngredients = typeof dislikedIngredientsSchema.infer; 
