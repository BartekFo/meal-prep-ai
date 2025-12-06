import { and, asc, desc, eq, ilike, type SQL } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { recipes } from '$lib/server/db/schema';
import type { Recipe, RecipeFilters } from '../types';
import { fromPromise, safeTry, type ResultAsync } from 'neverthrow';
import { DbInternalError, type DbError } from '$lib/errors/db';
import { unwrapSingleQueryResult } from '$lib/utils/unwrapSingleQueryResult';

export type NewRecipe = typeof recipes.$inferInsert;

export function getAllRecipes(
	userId: string,
	filters?: RecipeFilters
): ResultAsync<Recipe[], DbError> {
	return fromPromise(
		(async () => {
			const conditions = [eq(recipes.userId, userId)];

			if (filters?.search) {
				conditions.push(ilike(recipes.title, `%${filters.search}%`));
			}

			if (filters?.type && filters.type !== 'all') {
				conditions.push(eq(recipes.mealType, filters.type));
			}

			let orderBy: SQL;
			switch (filters?.sort) {
				case 'oldest':
					orderBy = asc(recipes.createdAt);
					break;
				case 'a-z':
					orderBy = asc(recipes.title);
					break;
				case 'z-a':
					orderBy = desc(recipes.title);
					break;
				default:
					orderBy = desc(recipes.createdAt);
			}

			return db
				.select()
				.from(recipes)
				.where(and(...conditions))
				.orderBy(orderBy);
		})(),
		(e) => new DbInternalError({ cause: e })
	);
}

export function getRecipeById(id: number, userId: string): ResultAsync<Recipe, DbError> {
	return safeTry(async function* () {
		const result = yield* fromPromise(
			db
				.select()
				.from(recipes)
				.where(and(eq(recipes.id, id), eq(recipes.userId, userId)))
				.limit(1),
			(e) => new DbInternalError({ cause: e })
		);

		return unwrapSingleQueryResult(result, String(id), 'Recipe');
	});
}

export function updateRecipeRecord(
	id: number,
	recipe: NewRecipe,
	userId: string
): ResultAsync<Recipe, DbError> {
	return safeTry(async function* () {
		const result = yield* fromPromise(
			db
				.update(recipes)
				.set(recipe)
				.where(and(eq(recipes.id, id), eq(recipes.userId, userId)))
				.returning(),
			(e) => new DbInternalError({ cause: e })
		);

		return unwrapSingleQueryResult(result, String(id), 'Recipe');
	});
}

export function deleteRecipeRecord(id: number, userId: string): ResultAsync<void, DbError> {
	return fromPromise(
		db
			.delete(recipes)
			.where(and(eq(recipes.id, id), eq(recipes.userId, userId)))
			.then(() => undefined),
		(e) => new DbInternalError({ cause: e })
	);
}
