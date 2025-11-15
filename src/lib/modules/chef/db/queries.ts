import { DbInternalError, type DbError } from '$lib/errors/db';
import { db } from '$lib/server/db';
import { chat, message } from '$lib/server/db/schema';
import { unwrapSingleQueryResult } from '$lib/utils/unwrapSingleQueryResult';
import { and, asc, desc, eq } from 'drizzle-orm';
import { fromPromise, ok, safeTry, type ResultAsync } from 'neverthrow';

export type Chat = typeof chat.$inferSelect;
export type Message = typeof message.$inferSelect;
export type NewChat = typeof chat.$inferInsert;
export type NewMessage = typeof message.$inferInsert;

export function getChatById({
	id,
	userId
}: {
	id: string;
	userId: string;
}): ResultAsync<Chat, DbError> {
	return safeTry(async function* () {
		const chatResult = yield* fromPromise(
			db
				.select()
				.from(chat)
				.where(and(eq(chat.id, id), eq(chat.userId, userId))),
			(e) => new DbInternalError({ cause: e })
		);

		return unwrapSingleQueryResult(chatResult, id, 'Chat');
	});
}

export function getChatsByUserId({ id }: { id: string }): ResultAsync<Chat[], DbError> {
	return fromPromise(
		db.select().from(chat).where(eq(chat.userId, id)).orderBy(desc(chat.createdAt)),
		(e) => new DbInternalError({ cause: e })
	);
}

export function getMessagesByChatId({ id }: { id: string }): ResultAsync<Message[], DbError> {
	return safeTry(async function* () {
		const messages = yield* fromPromise(
			db.select().from(message).where(eq(message.chatId, id)).orderBy(asc(message.createdAt)),
			(e) => new DbInternalError({ cause: e })
		);

		return ok(messages);
	});
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

export function deleteChatById({ id }: { id: string }): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		const actions = [
			() => db.delete(message).where(eq(message.chatId, id)),
			() => db.delete(chat).where(eq(chat.id, id))
		];

		for (const action of actions) {
			yield* fromPromise(action(), (e) => new DbInternalError({ cause: e }));
		}

		return ok(undefined);
	});
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
