import z from 'zod';

export const recipeSchema = z.object({
	title: z.string().describe('Recipe title'),
	description: z.string().optional().describe('Recipe description'),
	ingredients: z.array(z.string()).describe('List of ingredients with quantities'),
	servings: z.number().int().positive().describe('Number of servings'),
	prepTime: z.number().int().nonnegative().describe('Preparation time in minutes'),
	cookTime: z.number().int().nonnegative().describe('Cooking time in minutes'),
	mealType: z
		.enum(['breakfast', 'lunch', 'dinner', 'snack'])
		.describe('Meal type: breakfast, lunch, dinner, or snack'),
	instructions: z.array(z.string()).describe('Step-by-step cooking instructions'),
	calories: z.number().int().nonnegative().describe('Total calories per serving'),
	protein: z.number().int().nonnegative().describe('Protein in grams per serving'),
	carbs: z.number().int().nonnegative().describe('Carbohydrates in grams per serving'),
	fat: z.number().int().nonnegative().describe('Fat in grams per serving')
});
