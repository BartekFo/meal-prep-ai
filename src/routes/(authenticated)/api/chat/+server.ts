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
import { getAllRecipes } from "$lib/modules/recipes/db/queries";
import type { RecipeFilters } from "$lib/modules/recipes/types";

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
    },
  });

  return result.toUIMessageStreamResponse();
}
