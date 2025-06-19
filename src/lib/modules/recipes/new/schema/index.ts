import { type } from "arktype";


export const RecipeFormSchema = type({
  title: "string >= 3",
  description: "string | undefined",
  image: "File | undefined",
  prepTime: "number >= 1",
  cookTime: "number >= 1",
  servings: "number >= 1",
  mealType: "'breakfast' | 'lunch' | 'dinner' | 'snack'",
  calories: "number >= 0",
  protein: "number >= 0",
  carbs: "number >= 0",
  fat: "number >= 0",
  ingredients: "string[] > 0",
  instructions: "string[] > 0",
})

export type IRecipeFormValues = typeof RecipeFormSchema.infer
