import { MEAL_TYPES } from "@/lib/constants/meal-types";
import * as v from "valibot";

export const recipeFormSchema = v.object({
  title: v.pipe(
    v.string(),
    v.nonEmpty("Title is required"),
    v.minLength(3, "Title must be at least 3 characters"),
  ),
  description: v.optional(v.string()),
  image: v.optional(v.blob()),
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
  mealType: v.pipe(v.picklist(MEAL_TYPES), v.nonEmpty("Meal type is required")),
  calories: v.pipe(
    v.string(),
    v.transform(Number),
    v.number(),
    v.minValue(1, "Calories must be at least 0"),
    v.transform(String),
  ),
  protein: v.pipe(
    v.string(),
    v.transform(Number),
    v.number(),
    v.minValue(1, "Protein must be at least 1"),
    v.transform(String),
  ),
  carbs: v.pipe(
    v.string(),
    v.transform(Number),
    v.number(),
    v.minValue(1, "Carbs must be at least 1"),
    v.transform(String),
  ),
  fat: v.pipe(
    v.string(),
    v.transform(Number),
    v.number(),
    v.minValue(1, "Fat must be at least 1"),
    v.transform(String),
  ),
  ingredients: v.pipe(
    v.array(v.pipe(v.string(), v.nonEmpty("Ingredient is required"))),
    v.minLength(1, "At least one ingredient is required"),
  ),
  instructions: v.pipe(
    v.array(v.pipe(v.string(), v.nonEmpty("Instruction is required"))),
    v.minLength(1, "At least one instruction is required"),
  ),
});

export interface IRecipeFormValues
  extends v.InferOutput<typeof recipeFormSchema> {}
