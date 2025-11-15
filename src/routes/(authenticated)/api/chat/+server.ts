import { GEMINI_API_KEY } from '$env/static/private';
import { saveMessage, updateChatTitle } from '$lib/modules/chef/db/queries';
import {
	formatMemoriesForPrompt,
	getRelevantMemories,
	memory,
	seedInitialMemories
} from '$lib/server/memory';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from 'ai';
import { generateTitleFromMessage } from './generate-title';
import { initializeChat } from './initialize-chat';
import { createConfirmAddRecipeTool } from './tools/confirm-add-recipe-tool';
import { createConfirmSaveMemoryTool } from './tools/confirm-save-memory-tool';
import { createGenerateRecipeTool } from './tools/generate-recipe-tool';
import { createProposeMemoryTool } from './tools/propose-memory-tool';
import { createRecipesTool } from './tools/recipes-tool';

export type { RecipeToolOutput } from './types';

const google = createGoogleGenerativeAI({
	apiKey: GEMINI_API_KEY
});

export async function POST({ request, locals }) {
	const { messages, id }: { messages: UIMessage[]; id?: string } = await request.json();

	if (!locals.user) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401
		});
	}

	const { chatId: currentChatId, messages: allMessages } = await initializeChat(
		id,
		locals.user.id,
		messages
	);

	const userId = locals.user.id;
	const lastUserMessage = messages[messages.length - 1];
	const isNewChat = !id;

	if (lastUserMessage && lastUserMessage.role === 'user') {
		await saveMessage(currentChatId, 'user', lastUserMessage.parts);
	}

	const userMessageText =
		lastUserMessage && lastUserMessage.role === 'user'
			? lastUserMessage.parts
					.filter((p) => p.type === 'text')
					.map((p) => ('text' in p ? p.text : ''))
					.join(' ')
			: '';

	const existingMemories = await memory.getAll({ userId, limit: 1 });
	if (existingMemories.results.length === 0) {
		await seedInitialMemories(userId, locals.user);
	}

	const relevantMemories = userMessageText
		? await getRelevantMemories(userId, userMessageText, 5)
		: [];
	const memoryContext = formatMemoriesForPrompt(relevantMemories);

	const systemPrompt = `You are a helpful AI chef assistant that helps users with meal planning, recipe suggestions, and cooking advice.${memoryContext}

CRITICAL - MEMORY MANAGEMENT (ALWAYS CHECK THIS FIRST):
You can and MUST call multiple tools in the same response when appropriate. Memory saving is INDEPENDENT from other actions.

ALWAYS scan EVERY user message for food preferences/restrictions:
- Food dislikes: "I don't like X", "I hate X", "not a fan of X", "nie lubię X"
- Allergies: "I'm allergic to X", "X gives me a reaction", "jestem uczulony na X"  
- Dietary preferences: "I prefer X", "I love X", "preferuję X"
- Dietary restrictions: "I avoid X", "I don't eat X", "I can't have X"

MANDATORY WORKFLOW - When you detect ANY preference:
1. Call proposeMemory tool IMMEDIATELY (even if you're also generating a recipe or using other tools)
2. Continue with other actions (generateRecipe, respond with text, etc.)

EXAMPLES OF MULTI-TOOL USAGE:
- User asks for recipe, then says "I don't like kidney beans":
  * Call proposeMemory(content: "User dislikes kidney beans", context: "Food preference")  
  * Call generateRecipe without kidney beans
  * Both tools are called in the SAME response
  
- User: "I'm allergic to peanuts, can you suggest a snack?":
  * Call proposeMemory(content: "User is allergic to peanuts", context: "CRITICAL - Allergy")
  * Respond with text suggestions

YOU CAN CALL TOOLS MULTIPLE TIMES. proposeMemory does NOT prevent you from calling other tools. The user will see a memory card they can accept/dismiss.`;

	const result = streamText({
		model: google('gemini-2.5-flash-lite'),
		system: systemPrompt,
		messages: convertToModelMessages(allMessages),
		stopWhen: stepCountIs(5),
		tools: {
			recipes: createRecipesTool(locals),
			generateRecipe: createGenerateRecipeTool(userId),
			confirmAddRecipe: createConfirmAddRecipeTool(locals),
			proposeMemory: createProposeMemoryTool(),
			confirmSaveMemory: createConfirmSaveMemoryTool(userId)
		}
	});

	return result.toUIMessageStreamResponse({
		originalMessages: allMessages,
		onFinish: async ({ messages: finalMessages }) => {
			const newMessages = finalMessages.slice(allMessages.length);

			for (const message of newMessages) {
				await saveMessage(currentChatId, message.role, message.parts);
			}

			if (isNewChat && lastUserMessage) {
				const title = await generateTitleFromMessage(lastUserMessage);
				await updateChatTitle(currentChatId, title, userId);
			}
		}
	});
}
