import { db } from "$lib/server/db";
import { recipes } from "$lib/server/db/schema";
import { eq, desc, asc, ilike, and } from "drizzle-orm";
import type { Recipe, RecipeFilters } from "../types";

export async function getAllRecipes(userId: string, filters?: RecipeFilters): Promise<Recipe[]> {
  const conditions = [eq(recipes.userId, userId)];

  if (filters?.search) {
    conditions.push(ilike(recipes.title, `%${filters.search}%`));
  }

  if (filters?.type && filters.type === undefined) {
    conditions.push(eq(recipes.mealType, filters.type));
  }

  let orderBy;
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

  const result = await db
    .select()
    .from(recipes)
    .where(and(...conditions))
    .orderBy(orderBy);

  return result;
}

export async function getRecipeById(id: number, userId: string): Promise<Recipe | null> {
  const result = await db
    .select()
    .from(recipes)
    .where(and(eq(recipes.id, id), eq(recipes.userId, userId)))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0];
} 
