import { json } from '@sveltejs/kit';
import { getShoppingItem, markAsPurchased } from '$lib/modules/shopping';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, params, request }) => {
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

		const { expiryDate } = await request.json();

		const updateResult = await markAsPurchased(id, expiryDate ? new Date(expiryDate) : undefined);

		if (updateResult.isErr()) {
			console.error('Error marking item as purchased:', updateResult.error);
			return json({ error: 'Failed to mark as purchased' }, { status: 500 });
		}

		return json({ item: updateResult.value });
	} catch (error) {
		console.error('Error marking item as purchased:', error);
		return json({ error: 'Failed to mark as purchased' }, { status: 500 });
	}
};
