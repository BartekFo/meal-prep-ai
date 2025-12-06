import {
	addShoppingItem,
	deleteShoppingItem,
	getFridgeItemsWithExpiry,
	getShoppingList,
	markAsPurchased
} from '$lib/modules/shopping';
import { ShoppingItemFormSchema } from '$lib/modules/shopping/schema';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	const [shoppingResult, fridgeResult, form] = await Promise.all([
		getShoppingList(locals.user.id),
		getFridgeItemsWithExpiry(locals.user.id),
		superValidate(zod4(ShoppingItemFormSchema))
	]);

	const shoppingItems = shoppingResult.isOk() ? shoppingResult.value : [];
	const fridgeItems = fridgeResult.isOk() ? fridgeResult.value : [];

	return {
		shoppingItems,
		fridgeItems,
		form
	};
};

export const actions: Actions = {
	addItem: async ({ locals, request }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const form = await superValidate(request, zod4(ShoppingItemFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const result = await addShoppingItem(
			locals.user.id,
			form.data.name,
			form.data.quantity,
			form.data.unit
		);

		if (result.isErr()) {
			console.error('Error adding item:', result.error);
			return fail(500, { form, error: 'Failed to add item' });
		}

		return { form };
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

		const result = await deleteShoppingItem(id);

		if (result.isErr()) {
			console.error('Error deleting item:', result.error);
			return fail(500, { error: 'Failed to delete item' });
		}

		return { success: true };
	},

	purchaseItems: async ({ locals, request }) => {
		if (!locals.user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const ids = formData.getAll('ids[]').map((id) => parseInt(id.toString()));

		if (ids.length === 0) {
			return fail(400, { error: 'No items selected' });
		}

		for (const id of ids) {
			const result = await markAsPurchased(id);
			if (result.isErr()) {
				console.error('Error marking items as purchased:', result.error);
				return fail(500, { error: 'Failed to mark items as purchased' });
			}
		}

		return { success: true };
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

		const result = await deleteShoppingItem(id);

		if (result.isErr()) {
			console.error('Error removing from fridge:', result.error);
			return fail(500, { error: 'Failed to remove from fridge' });
		}

		return { success: true };
	}
};
