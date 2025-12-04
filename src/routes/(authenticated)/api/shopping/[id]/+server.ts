import { json } from '@sveltejs/kit';
import { getShoppingItem, updateShoppingItem, deleteShoppingItem } from '$lib/modules/shopping';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const id = parseInt(params.id);
		const item = await getShoppingItem(id);

		if (!item) {
			return json({ error: 'Item not found' }, { status: 404 });
		}

		if (item.userId !== locals.user.id) {
			return json({ error: 'Forbidden' }, { status: 403 });
		}

		return json({ item });
	} catch (error) {
		console.error('Error fetching item:', error);
		return json({ error: 'Failed to fetch item' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ locals, params, request }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const id = parseInt(params.id);
		const item = await getShoppingItem(id);

		if (!item) {
			return json({ error: 'Item not found' }, { status: 404 });
		}

		if (item.userId !== locals.user.id) {
			return json({ error: 'Forbidden' }, { status: 403 });
		}

		const updates = await request.json();
		const updated = await updateShoppingItem(id, updates);

		return json({ item: updated });
	} catch (error) {
		console.error('Error updating item:', error);
		return json({ error: 'Failed to update item' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const id = parseInt(params.id);
		const item = await getShoppingItem(id);

		if (!item) {
			return json({ error: 'Item not found' }, { status: 404 });
		}

		if (item.userId !== locals.user.id) {
			return json({ error: 'Forbidden' }, { status: 403 });
		}

		await deleteShoppingItem(id);
		return json({ success: true });
	} catch (error) {
		console.error('Error deleting item:', error);
		return json({ error: 'Failed to delete item' }, { status: 500 });
	}
};
