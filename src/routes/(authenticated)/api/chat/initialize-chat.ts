import { createChat, getChatById } from '$lib/modules/chef/db/queries';
import type { UIMessage } from 'ai';

export async function initializeChat(
	chatId: string | undefined,
	userId: string,
	incomingMessages: UIMessage[]
): Promise<{ chatId: string; messages: UIMessage[] }> {
	if (!chatId) {
		const newChat = await createChat(userId, 'New Chat');
		return {
			chatId: newChat.id,
			messages: incomingMessages
		};
	}

	const existingChat = await getChatById(chatId, userId);
	if (!existingChat) {
		return {
			chatId,
			messages: incomingMessages
		};
	}

	const dbMessageIds = new Set(existingChat.messages.map((msg) => msg.id));
	const incomingMessageIds = new Set(incomingMessages.map((msg) => msg.id));

	const hasAllDbMessages = existingChat.messages.every((msg) => incomingMessageIds.has(msg.id));

	if (hasAllDbMessages) {
		return {
			chatId,
			messages: incomingMessages
		};
	}

	const dbMessages: UIMessage[] = existingChat.messages.map((msg) => ({
		id: msg.id,
		role: msg.role as 'user' | 'assistant',
		parts: msg.parts as UIMessage['parts']
	}));

	const newMessagesOnly = incomingMessages.filter((msg) => !dbMessageIds.has(msg.id));

	return {
		chatId,
		messages: [...dbMessages, ...newMessagesOnly]
	};
}
