import { ResultAsync } from "neverthrow";
import type { RecipeToolOutput } from "$lib/modules/recipes/components/generated-recipe-card.svelte";
import {
  createRecipeRecord,
  type NewRecipe,
} from "$lib/modules/recipes/new/db/queries";

export function addChatRecipe(
  recipe: RecipeToolOutput,
  userId: string
): ResultAsync<void, Error> {
  const newRecipe: NewRecipe = {
    userId,
    title: recipe.title,
    description: recipe.description ?? null,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    mealType: recipe.mealType,
    instructions: recipe.instructions,
    calories: recipe.calories,
    protein: recipe.protein,
    carbs: recipe.carbs,
    fat: recipe.fat,
    imageUrl: null,
    imageData: null,
    imageType: null,
    imageSize: null,
  };

  return ResultAsync.fromPromise(
    createRecipeRecord(newRecipe).then(() => {
      // Recipe created successfully
    }),
    (error) =>
      new Error(
        `Failed to add recipe: ${error instanceof Error ? error.message : String(error)}`
      )
  );
}
