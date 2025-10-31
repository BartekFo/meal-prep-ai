import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { GEMINI_API_KEY } from "$env/static/private";
import { createConfirmAddRecipeTool } from "./tools/confirm-add-recipe-tool";
import { createGenerateRecipeTool } from "./tools/generate-recipe-tool";
import { createRecipesTool } from "./tools/recipes-tool";

export type { RecipeToolOutput } from "./types";

const google = createGoogleGenerativeAI({
  apiKey: GEMINI_API_KEY,
});

export async function POST({ request, locals }) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  if (!locals.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      recipes: createRecipesTool(locals),
      generateRecipe: createGenerateRecipeTool(),
      confirmAddRecipe: createConfirmAddRecipeTool(locals),
    },
  });

  return result.toUIMessageStreamResponse();
}
