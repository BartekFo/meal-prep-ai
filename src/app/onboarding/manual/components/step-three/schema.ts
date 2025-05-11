import * as v from "valibot";

export const ingredientSchema = v.pipe(
  v.string(),
  v.minLength(1, "Ingredient name cannot be empty."),
);

export const dislikedIngredientSchema = v.array(ingredientSchema);

export type DislikedIngredientSchema = v.InferOutput<
  typeof dislikedIngredientSchema
>;
