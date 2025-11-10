import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject, tool } from 'ai';
import z from 'zod';
import { GEMINI_API_KEY } from '$env/static/private';
import { formatMemoriesForPrompt, getRelevantMemories } from '$lib/server/memory';
import type { RecipeToolOutput } from '../types';
import { recipeSchema } from './schemas';

const google = createGoogleGenerativeAI({
	apiKey: GEMINI_API_KEY
});

export function createGenerateRecipeTool(userId: string) {
	return tool({
		description:
			"Generate a complete recipe based on user requirements. When called, this tool will generate and display the recipe in a structured card format. Do not provide a text description of the recipe - the tool output will be displayed automatically. Just call this tool with the user's recipe request.",
		inputSchema: z.object({
			request: z.string().describe("User's recipe request")
		}),
		execute: async ({ request }): Promise<RecipeToolOutput> => {
			const relevantMemories = await getRelevantMemories(userId, request, 5);
			const memoryContext = formatMemoriesForPrompt(relevantMemories);

			const prompt = `Generate a complete recipe based on this request: "${request}".${memoryContext}

IMPORTANT: You must strictly comply with the user's preferences and restrictions from the context above. This includes:
- Dietary restrictions (allergies, dietary type like vegetarian, vegan, etc.)
- Disliked foods (do not include these ingredients)
- Preferred meal types
- Any other dietary preferences mentioned

Provide a detailed recipe with:
- A descriptive title
- Optional description
- List of ingredients with quantities (ensure no allergens or disliked foods)
- Step-by-step cooking instructions
- Accurate prep and cook times in minutes
- Number of servings
- Appropriate meal type (breakfast, lunch, dinner, or snack)
- Nutritional information per serving (calories, protein in grams, carbs in grams, fat in grams)

Make sure all values are realistic, the recipe is complete, and it fully respects the user's preferences and restrictions.`;

			const { object } = await generateObject({
				model: google('gemini-2.5-flash'),
				schema: recipeSchema,
				prompt
			});

			return object as RecipeToolOutput;
		},
		outputSchema: recipeSchema
	});
}
