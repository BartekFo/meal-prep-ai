import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject, tool } from "ai";
import z from "zod";
import { GEMINI_API_KEY } from "$env/static/private";
import type { RecipeToolOutput } from "../types";
import { recipeSchema } from "./schemas";

const google = createGoogleGenerativeAI({
  apiKey: GEMINI_API_KEY,
});

export function createGenerateRecipeTool() {
  return tool({
    description:
      "Generate a complete recipe based on user requirements. When called, this tool will generate and display the recipe in a structured card format. Do not provide a text description of the recipe - the tool output will be displayed automatically. Just call this tool with the user's recipe request.",
    inputSchema: z.object({
      request: z.string().describe("User's recipe request"),
    }),
    execute: async ({ request }): Promise<RecipeToolOutput> => {
      const { object } = await generateObject({
        model: google("gemini-2.5-flash"),
        schema: recipeSchema,
        prompt: `Generate a complete recipe based on this request: "${request}". 
        
Provide a detailed recipe with:
- A descriptive title
- Optional description
- List of ingredients with quantities
- Step-by-step cooking instructions
- Accurate prep and cook times in minutes
- Number of servings
- Appropriate meal type (breakfast, lunch, dinner, or snack)
- Nutritional information per serving (calories, protein in grams, carbs in grams, fat in grams)

Make sure all values are realistic and the recipe is complete.`,
      });

      return object as RecipeToolOutput;
    },
    outputSchema: recipeSchema,
  });
}
