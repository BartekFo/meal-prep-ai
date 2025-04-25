import * as v from "valibot";

export const recipeFormSchema = v.object({
  title: v.pipe(
    v.string(),
    v.nonEmpty("Title is required"),
    v.minLength(3, "Title must be at least 3 characters"),
  ),
  description: v.optional(v.string()),
  image: v.optional(v.file()),
  prepTime: v.pipe(
    v.string(),
    v.nonEmpty("Prep time is required"),
    v.transform(Number),
    v.integer(),
    v.minValue(1, "Prep time must be at least 1 minute"),
    v.transform(String),
  ),
  cookTime: v.pipe(
    v.string(),
    v.nonEmpty("Cook time is required"),
    v.transform(Number),
    v.integer(),
    v.minValue(1, "Cook time must be at least 1 minute"),
    v.transform(String),
  ),
  servings: v.pipe(
    v.string(),
    v.transform(Number),
    v.number(),
    v.integer(),
    v.minValue(1, "Servings must be at least 1"),
    v.transform(String),
  ),
  mealType: v.pipe(v.string(), v.nonEmpty("Meal type is required")),
  ingredients: v.pipe(
    v.array(v.pipe(v.string(), v.nonEmpty("Ingredient is required"))),
    v.minLength(1, "At least one ingredient is required"),
  ),
  instructions: v.pipe(
    v.array(v.string()),
    v.minLength(1, "At least one instruction is required"),
  ),
});

export interface IRecipeFormValues
  extends v.InferOutput<typeof recipeFormSchema> {}
