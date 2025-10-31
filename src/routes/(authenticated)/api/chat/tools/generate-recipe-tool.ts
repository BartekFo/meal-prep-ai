import { tool } from "ai";
import z from "zod";
import type { RecipeToolOutput } from "../types";
import { recipeSchema } from "./schemas";

export function createGenerateRecipeTool() {
  return tool({
    description: "Generate a complete recipe based on user requirements",
    inputSchema: z.object({
      request: z.string().describe("User's recipe request"),
    }),
    execute: (): RecipeToolOutput => ({
      title: "",
      description: "",
      ingredients: [],
      servings: 0,
      prepTime: 0,
      cookTime: 0,
      mealType: "dinner",
      instructions: [],
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }),
    outputSchema: recipeSchema,
  });
}
