import { deleteChatById, getChatById, saveChat, saveMessages } from '$lib/modules/chef/db/queries';
import { google } from '$lib/modules/chef/google';
import { getMostRecentUserMessage } from '$lib/modules/chef/utils';
import type { Chat } from '$lib/server/db/schema';
import {
	formatMemoriesForPrompt,
	getRelevantMemories,
	memory,
	seedInitialMemories
} from '$lib/server/memory';
import { error, json } from '@sveltejs/kit';
import {
	convertToModelMessages,
	generateId,
	smoothStream,
	stepCountIs,
	streamText,
	type UIMessage
} from 'ai';
import { ok, safeTry } from 'neverthrow';
import { generateTitleFromUserMessage } from './generate-title';
import { getSystemPrompt } from './prompt';
import { createConfirmAddRecipeTool } from './tools/confirm-add-recipe-tool';
import { createConfirmSaveMemoryTool } from './tools/confirm-save-memory-tool';
import { createGenerateRecipeTool } from './tools/generate-recipe-tool';
import { createProposeMemoryTool } from './tools/propose-memory-tool';
import { createRecipesTool } from './tools/recipes-tool';

export type { RecipeToolOutput } from './types';

export async function POST({ request, locals: { user } }) {
	const { messages, id }: { messages: UIMessage[]; id: string } = await request.json();

	if (!user) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401
		});
	}

	const userMessage = getMostRecentUserMessage(messages);

	if (!userMessage) {
		error(400, 'No user message found');
	}

	const userId = user.id;

	if (user) {
		await safeTry(async function* () {
			let chat: Chat;
			const chatResult = await getChatById({ id, userId });
			console.log('chatResult', chatResult.isErr());
			if (chatResult.isErr()) {
				if (chatResult.error._tag !== 'DbEntityNotFoundError') {
					console.log('chatResult.error is not DbEntityNotFoundError');
					return chatResult;
				}
				const title = yield* generateTitleFromUserMessage({ message: userMessage });
				console.log('title', title);
				chat = yield* saveChat({ id, userId: user.id, title });
				console.log('chat', chat);
			} else {
				chat = chatResult.value;
			}

			console.log('chat', chat);

			if (chat.userId !== user.id) {
				error(403, 'Forbidden');
			}

			yield* saveMessages({
				messages: [
					{
						chatId: id,
						id: userMessage.id,
						role: 'user',
						parts: userMessage.parts,
						createdAt: new Date()
					}
				]
			});

			console.log('messages saved');

			return ok(undefined);
		}).orElse(() => error(500, 'An error occurred while processing your request'));
	}

	const userMessageText =
		userMessage && userMessage.role === 'user'
			? userMessage.parts
					.filter((p) => p.type === 'text')
					.map((p) => ('text' in p ? p.text : ''))
					.join(' ')
			: '';

	const existingMemories = await memory.getAll({ userId, limit: 1 });
	if (existingMemories.results.length === 0) {
		await seedInitialMemories(user);
	}

	const relevantMemories = userMessageText
		? await getRelevantMemories(userId, userMessageText, 5)
		: [];
	const memoryContext = formatMemoriesForPrompt(relevantMemories);

	const systemPrompt = getSystemPrompt(memoryContext);

	const result = streamText({
		model: google('gemini-2.5-flash-lite'),
		system: systemPrompt,
		messages: convertToModelMessages(messages),
		experimental_transform: smoothStream({ chunking: 'word' }),
		stopWhen: stepCountIs(5),
		tools: {
			recipes: createRecipesTool(user),
			generateRecipe: createGenerateRecipeTool(userId),
			confirmAddRecipe: createConfirmAddRecipeTool(user),
			proposeMemory: createProposeMemoryTool(),
			confirmSaveMemory: createConfirmSaveMemoryTool(userId)
		}
	});

	return result.toUIMessageStreamResponse({
		originalMessages: messages,
		generateMessageId: () => generateId(),
		onFinish: async ({ responseMessage }) => {
			if (!user) return;
			await saveMessages({
				messages: [
					{
						id: responseMessage.id,
						chatId: id,
						role: responseMessage.role,
						parts: responseMessage.parts,
						createdAt: new Date()
					}
				]
			});
		}
	});
}

export async function DELETE({ locals, request }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = await request.json();

	const deleted = await deleteChatById({ id });

	if (!deleted) {
		return json({ error: 'Chat not found' }, { status: 404 });
	}

	return json({ success: true });
}
