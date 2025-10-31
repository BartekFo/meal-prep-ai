import type { MealType } from "$lib/constants/meal-types";

export type RecipeToolOutput = {
  title: string;
  description?: string;
  ingredients: string[];
  servings: number;
  prepTime: number;
  cookTime: number;
  mealType: MealType;
  instructions: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
