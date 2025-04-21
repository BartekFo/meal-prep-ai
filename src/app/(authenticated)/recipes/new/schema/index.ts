import * as v from "valibot";

export const recipeFormSchema = v.object({
  title: v.pipe(
    v.string(),
    v.nonEmpty("Title is required"),
    v.minLength(3, "Title must be at least 3 characters"),
  ),
  description: v.pipe(
    v.string(),
    v.nonEmpty("Description is required"),
    v.minLength(10, "Description must be at least 10 characters"),
  ),
  image: v.optional(v.string()),
  prepTime: v.pipe(v.string(), v.nonEmpty("Prep time is required")),
  cookTime: v.pipe(v.string(), v.nonEmpty("Cook time is required")),
  servings: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(1, "Servings must be at least 1"),
  ),
  mealType: v.pipe(v.string(), v.nonEmpty("Meal type is required")),
  calories: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(0, "Calories must be a positive number"),
  ),
  protein: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(0, "Protein must be a positive number"),
  ),
  carbs: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(0, "Carbs must be a positive number"),
  ),
  fat: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(0, "Fat must be a positive number"),
  ),
  ingredients: v.pipe(
    v.array(v.string()),
    v.minLength(1, "At least one ingredient is required"),
  ),
  instructions: v.pipe(
    v.array(v.string()),
    v.minLength(1, "At least one instruction is required"),
  ),
});

export interface IRecipeFormValues
  extends v.InferOutput<typeof recipeFormSchema> {}
