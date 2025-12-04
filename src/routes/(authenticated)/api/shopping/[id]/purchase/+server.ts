import { json } from '@sveltejs/kit';
import { getShoppingItem, markAsPurchased } from '$lib/modules/shopping';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, params, request }) => {
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

		const { expiryDate } = await request.json();

		const updated = await markAsPurchased(id, expiryDate ? new Date(expiryDate) : undefined);

		return json({ item: updated });
	} catch (error) {
		console.error('Error marking item as purchased:', error);
		return json({ error: 'Failed to mark as purchased' }, { status: 500 });
	}
};
