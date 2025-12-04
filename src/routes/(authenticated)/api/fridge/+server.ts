import { json } from '@sveltejs/kit';
import { getFridgeItemsWithExpiry } from '$lib/modules/shopping';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const items = await getFridgeItemsWithExpiry(locals.user.id);
		return json({ items });
	} catch (error) {
		console.error('Error fetching fridge items:', error);
		return json({ error: 'Failed to fetch fridge items' }, { status: 500 });
	}
};
