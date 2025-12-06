import { json } from '@sveltejs/kit';
import { getShoppingItem, updateShoppingItem, deleteShoppingItem } from '$lib/modules/shopping';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const id = parseInt(params.id);
	const result = await getShoppingItem(id);

	if (result.isErr()) {
		console.error('Error fetching item:', result.error);
		return json({ error: 'Item not found' }, { status: 404 });
	}

	const item = result.value;

	if (item.userId !== locals.user.id) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	return json({ item });
};

export const PUT: RequestHandler = async ({ locals, params, request }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const id = parseInt(params.id);
		const itemResult = await getShoppingItem(id);

		if (itemResult.isErr()) {
			console.error('Error fetching item:', itemResult.error);
			return json({ error: 'Item not found' }, { status: 404 });
		}

		const item = itemResult.value;

		if (item.userId !== locals.user.id) {
			return json({ error: 'Forbidden' }, { status: 403 });
		}

		const updates = await request.json();
		const updateResult = await updateShoppingItem(id, updates);

		if (updateResult.isErr()) {
			console.error('Error updating item:', updateResult.error);
			return json({ error: 'Failed to update item' }, { status: 500 });
		}

		return json({ item: updateResult.value });
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
		const itemResult = await getShoppingItem(id);

		if (itemResult.isErr()) {
			console.error('Error fetching item:', itemResult.error);
			return json({ error: 'Item not found' }, { status: 404 });
		}

		const item = itemResult.value;

		if (item.userId !== locals.user.id) {
			return json({ error: 'Forbidden' }, { status: 403 });
		}

		const deleteResult = await deleteShoppingItem(id);

		if (deleteResult.isErr()) {
			console.error('Error deleting item:', deleteResult.error);
			return json({ error: 'Failed to delete item' }, { status: 500 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting item:', error);
		return json({ error: 'Failed to delete item' }, { status: 500 });
	}
};
