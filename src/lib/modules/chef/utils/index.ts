import type { Message as DBMessage } from '$lib/server/db/schema';
import type { UIMessage } from 'ai';

export function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
	return messages.map((message) => ({
		id: message.id,
		parts: message.parts as UIMessage['parts'],
		role: message.role as UIMessage['role'],
		createdAt: message.createdAt
	}));
}

export function getMostRecentUserMessage(messages: Array<UIMessage>) {
	const userMessages = messages.filter((message) => message.role === 'user');
	return userMessages.at(-1);
}
