import { db } from '$lib/server/db';
import { recipes } from '$lib/server/db/schema';

export type NewRecipe = typeof recipes.$inferInsert;

export function createRecipeRecord(recipe: NewRecipe) {
	return db.insert(recipes).values(recipe);
}
