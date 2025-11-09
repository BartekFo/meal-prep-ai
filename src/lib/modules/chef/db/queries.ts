import { db } from '$lib/server/db';
import { chat, message } from '$lib/server/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export type Chat = typeof chat.$inferSelect;
export type Message = typeof message.$inferSelect;
export type NewChat = typeof chat.$inferInsert;
export type NewMessage = typeof message.$inferInsert;

export async function getChats(userId: string): Promise<Chat[]> {
	const result = await db
		.select()
		.from(chat)
		.where(eq(chat.userId, userId))
		.orderBy(desc(chat.createdAt));

	return result;
}

export async function getChatById(
	chatId: string,
	userId: string
): Promise<(Chat & { messages: Message[] }) | null> {
	const chatRecord = await db
		.select()
		.from(chat)
		.where(and(eq(chat.id, chatId), eq(chat.userId, userId)))
		.limit(1);

	if (chatRecord.length === 0) {
		return null;
	}

	const chatData = chatRecord[0];
	if (!chatData) {
		return null;
	}

	const messages = await db
		.select()
		.from(message)
		.where(eq(message.chatId, chatId))
		.orderBy(message.createdAt);

	return {
		id: chatData.id,
		createdAt: chatData.createdAt,
		title: chatData.title,
		userId: chatData.userId,
		messages: messages ?? null
	};
}

export async function createChat(userId: string, title: string): Promise<Chat> {
	const result = await db
		.insert(chat)
		.values({
			userId,
			title
		})
		.returning();

	const newChat = result[0];
	if (!newChat) {
		throw new Error('Failed to create chat');
	}

	return newChat;
}

export async function deleteChat(chatId: string, userId: string): Promise<boolean> {
	const chatRecord = await getChatById(chatId, userId);

	if (!chatRecord) {
		return false;
	}

	await db.delete(message).where(eq(message.chatId, chatId));
	await db.delete(chat).where(and(eq(chat.id, chatId), eq(chat.userId, userId)));

	return true;
}

export async function saveMessage(chatId: string, role: string, parts: unknown): Promise<Message> {
	const result = await db
		.insert(message)
		.values({
			chatId,
			role,
			parts: parts as never
		})
		.returning();

	const newMessage = result[0];
	if (!newMessage) {
		throw new Error('Failed to save message');
	}

	return newMessage;
}

export async function updateChatTitle(
	chatId: string,
	title: string,
	userId: string
): Promise<boolean> {
	const result = await db
		.update(chat)
		.set({ title })
		.where(and(eq(chat.id, chatId), eq(chat.userId, userId)))
		.returning();

	return result.length > 0;
}
