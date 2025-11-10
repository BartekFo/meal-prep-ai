import { GEMINI_API_KEY } from '$env/static/private';
import { saveMessage, updateChatTitle } from '$lib/modules/chef/db/queries';
import {
	formatMemoriesForPrompt,
	getRelevantMemories,
	memory,
	saveMemory,
	seedInitialMemories
} from '$lib/server/memory';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from 'ai';
import { generateTitleFromMessage } from './generate-title';
import { initializeChat } from './initialize-chat';
import { createConfirmAddRecipeTool } from './tools/confirm-add-recipe-tool';
import { createGenerateRecipeTool } from './tools/generate-recipe-tool';
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

	const systemPrompt = `You are a helpful AI chef assistant that helps users with meal planning, recipe suggestions, and cooking advice.${memoryContext}`;

	const result = streamText({
		model: google('gemini-2.5-flash-lite'),
		system: systemPrompt,
		messages: convertToModelMessages(allMessages),
		stopWhen: stepCountIs(5),
		tools: {
			recipes: createRecipesTool(locals),
			generateRecipe: createGenerateRecipeTool(),
			confirmAddRecipe: createConfirmAddRecipeTool(locals)
		}
	});

	return result.toUIMessageStreamResponse({
		originalMessages: allMessages,
		onFinish: async ({ messages: finalMessages }) => {
			const newMessages = finalMessages.slice(allMessages.length);

			for (const message of newMessages) {
				await saveMessage(currentChatId, message.role, message.parts);

				if (message.role === 'assistant') {
					const assistantText = message.parts
						.filter((p) => p.type === 'text')
						.map((p) => ('text' in p ? p.text : ''))
						.join(' ');

					if (assistantText.trim()) {
						await saveMemory(userId, assistantText, {
							source: 'chat',
							chatId: currentChatId,
							type: 'response'
						});
					}
				}
			}

			if (userMessageText.trim()) {
				await saveMemory(userId, userMessageText, {
					source: 'chat',
					chatId: currentChatId,
					type: 'query'
				});
			}

			if (isNewChat && lastUserMessage) {
				const title = await generateTitleFromMessage(lastUserMessage);
				await updateChatTitle(currentChatId, title, userId);
			}
		}
	});
}
