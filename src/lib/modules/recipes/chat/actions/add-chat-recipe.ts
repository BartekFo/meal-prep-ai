import { createRecipeRecord, type NewRecipe } from '$lib/modules/recipes/new/db/queries';
import { errAsync, ResultAsync } from 'neverthrow';
import { z } from 'zod';
import type { RecipeToolOutput } from '../types';

const RecipeToolOutputSchema = z.object({
	title: z.string().min(3),
	description: z.string().optional(),
	ingredients: z.array(z.string()).min(1),
	servings: z.number().int().min(1),
	prepTime: z.number().int().min(1),
	cookTime: z.number().int().min(1),
	mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
	instructions: z.array(z.string()).min(1),
	calories: z.number().int().min(1),
	protein: z.number().int().min(1),
	carbs: z.number().int().min(1),
	fat: z.number().int().min(1)
});

export function addChatRecipe(recipe: RecipeToolOutput, userId: string): ResultAsync<void, Error> {
	const validationResult = RecipeToolOutputSchema.safeParse(recipe);

	if (!validationResult.success) {
		return errAsync(
			new Error(
				`Invalid recipe data: ${validationResult.error.errors.map((e) => e.message).join(', ')}`
			)
		);
	}

	const validatedRecipe = validationResult.data;

	const newRecipe: NewRecipe = {
		userId,
		title: validatedRecipe.title,
		description: validatedRecipe.description ?? null,
		ingredients: validatedRecipe.ingredients,
		servings: validatedRecipe.servings,
		prepTime: validatedRecipe.prepTime,
		cookTime: validatedRecipe.cookTime,
		mealType: validatedRecipe.mealType,
		instructions: validatedRecipe.instructions,
		calories: validatedRecipe.calories,
		protein: validatedRecipe.protein,
		carbs: validatedRecipe.carbs,
		fat: validatedRecipe.fat,
		imageUrl: null,
		imageData: null,
		imageType: null,
		imageSize: null
	};

	return ResultAsync.fromPromise(
		createRecipeRecord(newRecipe).then(() => {
			// Recipe created successfully
		}),
		(error) =>
			new Error(`Failed to add recipe: ${error instanceof Error ? error.message : String(error)}`)
	);
}
