import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import z from "zod";
import { GEMINI_API_KEY } from "$env/static/private";
import type { MealType } from "$lib/constants/meal-types";
import { getAllRecipes } from "$lib/modules/recipes/db/queries";
import type { RecipeFilters } from "$lib/modules/recipes/types";

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

const google = createGoogleGenerativeAI({
  apiKey: GEMINI_API_KEY,
});

export async function POST({ request, locals }) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      recipes: tool({
        description:
          "Get recipes for the current user. Can filter by search term, meal type (breakfast, lunch, dinner, snack), and sort order (newest, oldest, a-z, z-a).",
        inputSchema: z.object({
          search: z
            .string()
            .optional()
            .describe("Search term to filter recipes by title"),
          type: z
            .enum(["all", "breakfast", "lunch", "dinner", "snack"])
            .optional()
            .describe("Filter recipes by meal type"),
          sort: z
            .enum(["newest", "oldest", "a-z", "z-a"])
            .optional()
            .describe("Sort order for recipes"),
        }),
        execute: async ({ search, type, sort }) => {
          if (!locals.user) {
            return {
              error: "User not authenticated",
              recipes: [],
            };
          }

          const filters: RecipeFilters = {};

          if (search) {
            filters.search = search;
          }

          if (type) {
            filters.type = type;
          }

          if (sort) {
            filters.sort = sort;
          }

          const recipes = await getAllRecipes(locals.user.id, filters);

          return {
            recipes,
            count: recipes.length,
          };
        },
      }),
      generateRecipe: tool({
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
        outputSchema: z.object({
          title: z.string().describe("Recipe title"),
          description: z.string().optional().describe("Recipe description"),
          ingredients: z
            .array(z.string())
            .describe("List of ingredients with quantities"),
          servings: z.number().int().positive().describe("Number of servings"),
          prepTime: z
            .number()
            .int()
            .nonnegative()
            .describe("Preparation time in minutes"),
          cookTime: z
            .number()
            .int()
            .nonnegative()
            .describe("Cooking time in minutes"),
          mealType: z
            .enum(["breakfast", "lunch", "dinner", "snack"])
            .describe("Meal type: breakfast, lunch, dinner, or snack"),
          instructions: z
            .array(z.string())
            .describe("Step-by-step cooking instructions"),
          calories: z
            .number()
            .int()
            .nonnegative()
            .describe("Total calories per serving"),
          protein: z
            .number()
            .int()
            .nonnegative()
            .describe("Protein in grams per serving"),
          carbs: z
            .number()
            .int()
            .nonnegative()
            .describe("Carbohydrates in grams per serving"),
          fat: z
            .number()
            .int()
            .nonnegative()
            .describe("Fat in grams per serving"),
        }),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
