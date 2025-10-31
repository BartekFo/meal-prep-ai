import { type } from "arktype";
import { errAsync, ResultAsync } from "neverthrow";
import {
  createRecipeRecord,
  type NewRecipe,
} from "$lib/modules/recipes/new/db/queries";
import type { RecipeToolOutput } from "../types";

const RecipeToolOutputSchema = type({
  title: "string >= 3",
  description: "string | undefined",
  ingredients: "string[] > 0",
  servings: "number >= 1",
  prepTime: "number >= 1",
  cookTime: "number >= 1",
  mealType: "'breakfast' | 'lunch' | 'dinner' | 'snack'",
  instructions: "string[] > 0",
  calories: "number >= 1",
  protein: "number >= 1",
  carbs: "number >= 1",
  fat: "number >= 1",
});

export function addChatRecipe(
  recipe: RecipeToolOutput,
  userId: string
): ResultAsync<void, Error> {
  const validationResult = RecipeToolOutputSchema(recipe);

  if (validationResult instanceof type.errors) {
    return errAsync(
      new Error(
        `Invalid recipe data: ${validationResult.summary ?? "Validation failed"}`
      )
    );
  }

  const validatedRecipe = validationResult;

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
