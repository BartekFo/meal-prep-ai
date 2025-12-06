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

export function saveChat({
	id,
	userId,
	title
}: {
	id: string;
	userId: string;
	title: string;
}): ResultAsync<Chat, DbError> {
	return safeTry(async function* () {
		const insertResult = yield* fromPromise(
			db
				.insert(chat)
				.values({
					id,
					createdAt: new Date(),
					userId,
					title
				})
				.returning(),
			(e) => new DbInternalError({ cause: e })
		);

		return unwrapSingleQueryResult(insertResult, id, 'Chat');
	});
}

export function deleteChatById({
	id,
	userId
}: {
	id: string;
	userId: string;
}): ResultAsync<undefined, DbError> {
	return safeTry(async function* () {
		// First verify ownership
		yield* getChatById({ id, userId });

		const actions = [
			() => db.delete(message).where(eq(message.chatId, id)),
			() => db.delete(chat).where(and(eq(chat.id, id), eq(chat.userId, userId)))
		];

		for (const action of actions) {
			yield* fromPromise(action(), (e) => new DbInternalError({ cause: e }));
		}

		return ok(undefined);
	});
}

export function saveMessages({
	messages
}: {
	messages: Array<Message>;
}): ResultAsync<Message[], DbError> {
	return safeTry(async function* () {
		const insertResult = yield* fromPromise(
			db.insert(message).values(messages).returning(),
			(e) => new DbInternalError({ cause: e })
		);

		return ok(insertResult);
	});
}

export function updateChatTitle(
	chatId: string,
	title: string,
	userId: string
): ResultAsync<boolean, DbError> {
	return fromPromise(
		db
			.update(chat)
			.set({ title })
			.where(and(eq(chat.id, chatId), eq(chat.userId, userId)))
			.returning()
			.then((result) => result.length > 0),
		(e) => new DbInternalError({ cause: e })
	);
}
