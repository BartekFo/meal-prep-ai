import { json } from '@sveltejs/kit';
import { addShoppingItem, getShoppingList } from '$lib/modules/shopping';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const items = await getShoppingList(locals.user.id);
		return json({ items });
	} catch (error) {
		console.error('Error fetching shopping list:', error);
		return json({ error: 'Failed to fetch shopping list' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { name, quantity = 1, unit = 'szt' } = await request.json();

		if (!name) {
			return json({ error: 'Name is required' }, { status: 400 });
		}

		const item = await addShoppingItem(locals.user.id, name, quantity, unit);
		return json({ item }, { status: 201 });
	} catch (error) {
		console.error('Error adding shopping item:', error);
		return json({ error: 'Failed to add item' }, { status: 500 });
	}
};
