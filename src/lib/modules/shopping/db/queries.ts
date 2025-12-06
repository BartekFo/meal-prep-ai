import { DbInternalError, type DbError } from '$lib/errors/db';
import { db } from '$lib/server/db';
import type { ShoppingItem } from '$lib/server/db/schema';
import { shoppingItems } from '$lib/server/db/schema';
import { unwrapSingleQueryResult } from '$lib/utils/unwrapSingleQueryResult';
import { and, asc, desc, eq } from 'drizzle-orm';
import { fromPromise, ok, safeTry, type ResultAsync } from 'neverthrow';

export function addShoppingItem(
	userId: string,
	name: string,
	quantity: number = 1,
	unit: string = 'szt'
): ResultAsync<ShoppingItem, DbError> {
	return safeTry(async function* () {
		const result = yield* fromPromise(
			db
				.insert(shoppingItems)
				.values({
					userId,
					name,
					quantity,
					unit,
					status: 'shopping'
				})
				.returning(),
			(e) => new DbInternalError({ cause: e })
		);

		return unwrapSingleQueryResult(result, `${userId}:${name}`, 'ShoppingItem');
	});
}

export function getShoppingList(userId: string): ResultAsync<ShoppingItem[], DbError> {
	return fromPromise(
		db.query.shoppingItems.findMany({
			where: and(eq(shoppingItems.userId, userId), eq(shoppingItems.status, 'shopping')),
			orderBy: asc(shoppingItems.createdAt)
		}),
		(e) => new DbInternalError({ cause: e })
	);
}

export function getFridgeItems(userId: string): ResultAsync<ShoppingItem[], DbError> {
	return fromPromise(
		db.query.shoppingItems.findMany({
			where: and(eq(shoppingItems.userId, userId), eq(shoppingItems.status, 'fridge')),
			orderBy: desc(shoppingItems.purchasedAt)
		}),
		(e) => new DbInternalError({ cause: e })
	);
}

export function getShoppingItem(id: number): ResultAsync<ShoppingItem, DbError> {
	return safeTry(async function* () {
		const result = yield* fromPromise(
			db.query.shoppingItems.findFirst({
				where: eq(shoppingItems.id, id)
			}),
			(e) => new DbInternalError({ cause: e })
		);

		return unwrapSingleQueryResult(
			[result].filter((r) => r !== undefined),
			String(id),
			'ShoppingItem'
		);
	});
}

export function updateShoppingItem(
	id: number,
	updates: Partial<{
		name: string;
		quantity: number;
		unit: string;
		status: 'shopping' | 'fridge';
		expiryDate: Date | null;
	}>
): ResultAsync<ShoppingItem, DbError> {
	return safeTry(async function* () {
		const result = yield* fromPromise(
			db
				.update(shoppingItems)
				.set({
					...updates,
					...(updates.status === 'fridge' && { purchasedAt: new Date() })
				})
				.where(eq(shoppingItems.id, id))
				.returning(),
			(e) => new DbInternalError({ cause: e })
		);

		return unwrapSingleQueryResult(result, String(id), 'ShoppingItem');
	});
}

export function deleteShoppingItem(id: number): ResultAsync<void, DbError> {
	return fromPromise(
		db
			.delete(shoppingItems)
			.where(eq(shoppingItems.id, id))
			.then(() => undefined),
		(e) => new DbInternalError({ cause: e })
	);
}

export function markAsPurchased(id: number, expiryDate?: Date): ResultAsync<ShoppingItem, DbError> {
	return updateShoppingItem(id, {
		status: 'fridge',
		expiryDate: expiryDate ?? null
	});
}

export function removeFromFridge(id: number): ResultAsync<void, DbError> {
	return deleteShoppingItem(id);
}

export function getFridgeItemsWithExpiry(
	userId: string
): ResultAsync<Array<ShoppingItem & { expiryStatus: 'fresh' | 'expiring' | 'expired' }>, DbError> {
	return safeTry(async function* () {
		const items = yield* getFridgeItems(userId);

		const now = new Date();
		const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

		const itemsWithStatus = items.map((item) => {
			let status: 'fresh' | 'expiring' | 'expired' = 'fresh';

			if (item.expiryDate) {
				if (item.expiryDate < now) {
					status = 'expired';
				} else if (item.expiryDate <= sevenDaysFromNow) {
					status = 'expiring';
				}
			}

			return { ...item, expiryStatus: status };
		});

		return ok(itemsWithStatus);
	});
}
