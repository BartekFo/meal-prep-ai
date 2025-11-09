import { addChatRecipe } from '$lib/modules/recipes/chat/actions/add-chat-recipe';
import { tool } from 'ai';
import type { RecipeToolOutput } from '../types';
import { recipeSchema } from './schemas';

export function createConfirmAddRecipeTool(locals: App.Locals) {
	return tool({
		description:
			"Confirm adding generated recipe to user's collection. Call this tool when the user wants to save a generated recipe.",
		inputSchema: recipeSchema,
		execute: async (recipeInput) => {
			if (!locals.user) {
				return {
					success: false,
					error: 'User not authenticated'
				};
			}

			const recipe: RecipeToolOutput = {
				title: recipeInput.title,
				...(recipeInput.description !== undefined && {
					description: recipeInput.description
				}),
				ingredients: recipeInput.ingredients,
				servings: recipeInput.servings,
				prepTime: recipeInput.prepTime,
				cookTime: recipeInput.cookTime,
				mealType: recipeInput.mealType,
				instructions: recipeInput.instructions,
				calories: recipeInput.calories,
				protein: recipeInput.protein,
				carbs: recipeInput.carbs,
				fat: recipeInput.fat
			};

			const addResult = await addChatRecipe(recipe, locals.user.id);
			if (addResult.isErr()) {
				return {
					success: false,
					error: addResult.error.message
				};
			}

			return {
				success: true,
				message: `Recipe "${recipe.title}" has been added to your collection!`
			};
		}
	});
}
