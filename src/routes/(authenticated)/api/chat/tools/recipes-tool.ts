import { tool } from 'ai';
import z from 'zod';
import { getAllRecipes } from '$lib/modules/recipes/db/queries';
import type { RecipeFilters } from '$lib/modules/recipes/types';
import type { User } from '$lib/types/auth';

export function createRecipesTool(user: User) {
	return tool({
		description:
			'Get recipes for the current user. Can filter by search term, meal type (breakfast, lunch, dinner, snack), and sort order (newest, oldest, a-z, z-a).',
		inputSchema: z.object({
			search: z.string().optional().describe('Search term to filter recipes by title'),
			type: z
				.enum(['all', 'breakfast', 'lunch', 'dinner', 'snack'])
				.optional()
				.describe('Filter recipes by meal type'),
			sort: z.enum(['newest', 'oldest', 'a-z', 'z-a']).optional().describe('Sort order for recipes')
		}),
		execute: async ({ search, type, sort }) => {
			if (!user) {
				return {
					error: 'User not authenticated',
					recipes: []
				};
			}

			const filters: RecipeFilters = {};

			if (search) {
				filters.search = search;
			}

			if (type) {
				filters.type = type;
			}

			if (sort) {
				filters.sort = sort;
			}

			const recipes = await getAllRecipes(user.id, filters);

			return {
				recipes,
				count: recipes.length
			};
		}
	});
}
