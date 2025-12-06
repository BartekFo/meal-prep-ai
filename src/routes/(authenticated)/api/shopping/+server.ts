import { json } from '@sveltejs/kit';
import { addShoppingItem, getShoppingList } from '$lib/modules/shopping';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const result = await getShoppingList(locals.user.id);

	if (result.isErr()) {
		console.error('Error fetching shopping list:', result.error);
		return json({ error: 'Failed to fetch shopping list' }, { status: 500 });
	}

	return json({ items: result.value });
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

		const result = await addShoppingItem(locals.user.id, name, quantity, unit);

		if (result.isErr()) {
			console.error('Error adding shopping item:', result.error);
			return json({ error: 'Failed to add item' }, { status: 500 });
		}

		return json({ item: result.value }, { status: 201 });
	} catch (error) {
		console.error('Error adding shopping item:', error);
		return json({ error: 'Failed to add item' }, { status: 500 });
	}
};
