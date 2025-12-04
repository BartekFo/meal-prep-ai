import { eq, and, desc, asc } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { shoppingItems } from '$lib/server/db/schema';
import type { ShoppingItem } from '$lib/server/db/schema';

export async function addShoppingItem(
	userId: string,
	name: string,
	quantity: number = 1,
	unit: string = 'szt'
): Promise<ShoppingItem> {
	const result = await db
		.insert(shoppingItems)
		.values({
			userId,
			name,
			quantity,
			unit,
			status: 'shopping'
		})
		.returning();

	return result[0];
}

export async function getShoppingList(userId: string): Promise<ShoppingItem[]> {
	return db.query.shoppingItems.findMany({
		where: and(eq(shoppingItems.userId, userId), eq(shoppingItems.status, 'shopping')),
		orderBy: asc(shoppingItems.createdAt)
	});
}

export async function getFridgeItems(userId: string): Promise<ShoppingItem[]> {
	return db.query.shoppingItems.findMany({
		where: and(eq(shoppingItems.userId, userId), eq(shoppingItems.status, 'fridge')),
		orderBy: desc(shoppingItems.purchasedAt)
	});
}

export async function getShoppingItem(id: number): Promise<ShoppingItem | null> {
	return db.query.shoppingItems.findFirst({
		where: eq(shoppingItems.id, id)
	});
}

export async function updateShoppingItem(
	id: number,
	updates: Partial<{
		name: string;
		quantity: number;
		unit: string;
		status: 'shopping' | 'fridge';
		expiryDate: Date | null;
	}>
): Promise<ShoppingItem> {
	const result = await db
		.update(shoppingItems)
		.set({
			...updates,
			...(updates.status === 'fridge' && !updates.purchasedAt && { purchasedAt: new Date() })
		})
		.where(eq(shoppingItems.id, id))
		.returning();

	return result[0];
}

export async function deleteShoppingItem(id: number): Promise<void> {
	await db.delete(shoppingItems).where(eq(shoppingItems.id, id));
}

export async function markAsPurchased(id: number, expiryDate?: Date): Promise<ShoppingItem> {
	return updateShoppingItem(id, {
		status: 'fridge',
		expiryDate
	});
}

export async function removeFromFridge(id: number): Promise<void> {
	await deleteShoppingItem(id);
}

export async function getFridgeItemsWithExpiry(userId: string) {
	const items = await getFridgeItems(userId);

	const now = new Date();
	const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

	return items.map((item) => {
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
}
