import type { UIMessage } from 'ai';
import type { Message as DBMessage } from '$lib/server/db/schema';

export function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
	return messages.map((message) => ({
		id: message.id,
		parts: message.parts as UIMessage['parts'],
		role: message.role as UIMessage['role'],
		createdAt: message.createdAt
	}));
}
