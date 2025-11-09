import { GEMINI_API_KEY } from '$env/static/private';
import {
	createChat,
	getChatById,
	saveMessage,
	updateChatTitle
} from '$lib/modules/chef/db/queries';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToModelMessages, generateText, stepCountIs, streamText, type UIMessage } from 'ai';
import { createConfirmAddRecipeTool } from './tools/confirm-add-recipe-tool';
import { createGenerateRecipeTool } from './tools/generate-recipe-tool';
import { createRecipesTool } from './tools/recipes-tool';

export type { RecipeToolOutput } from './types';

const google = createGoogleGenerativeAI({
	apiKey: GEMINI_API_KEY
});

async function generateTitleFromMessage(message: UIMessage): Promise<string> {
	const textPart = message.parts.find((p) => p.type === 'text');
	if (!textPart || !('text' in textPart)) {
		return 'New Chat';
	}

	const userMessage = textPart.text;

	try {
		const { text } = await generateText({
			model: google('gemini-2.5-flash-lite'),
			prompt: `Generate a concise, descriptive title (max 6 words) for a chat conversation that starts with this message: "${userMessage}"

Return only the title, nothing else.`
		});

		return text.trim() || 'New Chat';
	} catch (error) {
		console.error('Failed to generate chat title:', error);
		const fallback = userMessage.length > 50 ? `${userMessage.slice(0, 47)}...` : userMessage;
		return fallback;
	}
}

export async function POST({ request, locals }) {
	const { messages, id }: { messages: UIMessage[]; id?: string } = await request.json();

	if (!locals.user) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401
		});
	}

	let currentChatId = id;
	let allMessages = messages;

	if (!currentChatId) {
		const newChat = await createChat(locals.user.id, 'New Chat');
		currentChatId = newChat.id;
	} else {
		const existingChat = await getChatById(currentChatId, locals.user.id);
		if (existingChat) {
			const dbMessageIds = new Set(existingChat.messages.map((msg) => msg.id));
			const incomingMessageIds = new Set(messages.map((msg) => msg.id));

			const hasAllDbMessages = existingChat.messages.every((msg) => incomingMessageIds.has(msg.id));

			if (!hasAllDbMessages) {
				const dbMessages: UIMessage[] = existingChat.messages.map((msg) => ({
					id: msg.id,
					role: msg.role as 'user' | 'assistant',
					parts: msg.parts as UIMessage['parts']
				}));
				const newMessagesOnly = messages.filter((msg) => !dbMessageIds.has(msg.id));
				allMessages = [...dbMessages, ...newMessagesOnly];
			}
		}
	}

	const lastUserMessage = messages[messages.length - 1];
	const isNewChat = !id;

	if (lastUserMessage && lastUserMessage.role === 'user') {
		await saveMessage(currentChatId, 'user', lastUserMessage.parts);
	}

	const result = streamText({
		model: google('gemini-2.5-flash-lite'),
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
			}

			if (isNewChat && lastUserMessage && locals.user) {
				const title = await generateTitleFromMessage(lastUserMessage);
				await updateChatTitle(currentChatId, title, locals.user.id);
			}
		}
	});
}
