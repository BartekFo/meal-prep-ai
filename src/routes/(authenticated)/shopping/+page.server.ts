import { fail, redirect } from '@sveltejs/kit';
import {
	addShoppingItem,
	getShoppingList,
	getFridgeItemsWithExpiry,
	deleteShoppingItem,
	markAsPurchased
} from '$lib/modules/shopping';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	const [shoppingItems, fridgeItems] = await Promise.all([
		getShoppingList(locals.user.id),
		getFridgeItemsWithExpiry(locals.user.id)
	]);

	return {
		shoppingItems,
		fridgeItems
	};
};

export const actions: Actions = {
	addItem: async ({ locals, request }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString();
		const quantityStr = formData.get('quantity')?.toString();
		const unit = formData.get('unit')?.toString() || 'szt';

		if (!name || !quantityStr) {
			return fail(400, { error: 'Missing required fields' });
		}

		const quantity = parseInt(quantityStr) || 1;

		try {
			await addShoppingItem(locals.user.id, name, quantity, unit);
			return { success: true };
		} catch (error) {
			console.error('Error adding item:', error);
			return fail(500, { error: 'Failed to add item' });
		}
	},

	deleteItem: async ({ locals, request }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const idStr = formData.get('id')?.toString();

		if (!idStr) {
			return fail(400, { error: 'Missing item id' });
		}

		const id = parseInt(idStr);

		try {
			await deleteShoppingItem(id);
			return { success: true };
		} catch (error) {
			console.error('Error deleting item:', error);
			return fail(500, { error: 'Failed to delete item' });
		}
	},

	purchaseItem: async ({ locals, request }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const idStr = formData.get('id')?.toString();
		const expiryDateStr = formData.get('expiryDate')?.toString();

		if (!idStr) {
			return fail(400, { error: 'Missing item id' });
		}

		const id = parseInt(idStr);
		const expiryDate = expiryDateStr ? new Date(expiryDateStr) : undefined;

		try {
			await markAsPurchased(id, expiryDate);
			return { success: true };
		} catch (error) {
			console.error('Error marking as purchased:', error);
			return fail(500, { error: 'Failed to mark as purchased' });
		}
	},

	removeFromFridge: async ({ locals, request }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const idStr = formData.get('id')?.toString();

		if (!idStr) {
			return fail(400, { error: 'Missing item id' });
		}

		const id = parseInt(idStr);

		try {
			await deleteShoppingItem(id);
			return { success: true };
		} catch (error) {
			console.error('Error removing from fridge:', error);
			return fail(500, { error: 'Failed to remove from fridge' });
		}
	}
};
