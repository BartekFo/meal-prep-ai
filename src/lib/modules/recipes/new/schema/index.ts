import { z } from 'zod';

export const RecipeFormSchema = z.object({
	title: z.string().min(3),
	description: z.string().optional(),
	image: z.instanceof(File).optional(),
	prepTime: z.number().int().min(1),
	cookTime: z.number().int().min(1),
	servings: z.number().int().min(1),
	mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
	calories: z.number().int().min(1),
	protein: z.number().int().min(1),
	carbs: z.number().int().min(1),
	fat: z.number().int().min(1),
	ingredients: z.array(z.string()).min(1),
	instructions: z.array(z.string()).min(1)
});

export type IRecipeFormValues = z.infer<typeof RecipeFormSchema>;
