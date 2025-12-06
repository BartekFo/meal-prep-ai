import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';
import {
	addShoppingItem,
	getShoppingList,
	getFridgeItemsWithExpiry,
	deleteShoppingItem,
	markAsPurchased
} from '$lib/modules/shopping';
import { ShoppingItemFormSchema } from '$lib/modules/shopping/schema';
import type { PageServerLoad, Actions } from './$types';

const defaults = {
	name: '',
	quantity: 1,
	unit: 'piece' as const
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	const [shoppingItems, fridgeItems, form] = await Promise.all([
		getShoppingList(locals.user.id),
		getFridgeItemsWithExpiry(locals.user.id),
		superValidate(arktype(ShoppingItemFormSchema, { defaults }))
	]);

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

		const form = await superValidate(request, arktype(ShoppingItemFormSchema, { defaults }));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await addShoppingItem(locals.user.id, form.data.name, form.data.quantity, form.data.unit);
			return { form };
		} catch (error) {
			console.error('Error adding item:', error);
			return fail(500, { form, error: 'Failed to add item' });
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
