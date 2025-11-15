import { addChatRecipe } from '$lib/modules/recipes/chat/actions/add-chat-recipe';
import { tool } from 'ai';
import type { RecipeToolOutput } from '../types';
import { recipeSchema } from './schemas';
import type { User } from '$lib/types/auth';

export function createConfirmAddRecipeTool(user: User) {
	return tool({
		description:
			"Confirm adding generated recipe to user's collection. Call this tool when the user wants to save a generated recipe.",
		inputSchema: recipeSchema,
		execute: async (recipeInput) => {
			if (!user) {
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

			const addResult = await addChatRecipe(recipe, user.id);
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
