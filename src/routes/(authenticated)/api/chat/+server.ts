import { GEMINI_API_KEY } from '$env/static/private';
import { saveMessage, updateChatTitle } from '$lib/modules/chef/db/queries';
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
