import type { MealType } from '$lib/constants/meal-types';
import type { recipes } from '$lib/server/db/schema';

export type Recipe = typeof recipes.$inferSelect;

export type RecipeFilters = {
	search?: string;
	type?: MealType | 'all';
	sort?: string;
};
