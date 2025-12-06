import { json } from '@sveltejs/kit';
import { getFridgeItemsWithExpiry } from '$lib/modules/shopping';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const result = await getFridgeItemsWithExpiry(locals.user.id);

	if (result.isErr()) {
		console.error('Error fetching fridge items:', result.error);
		return json({ error: 'Failed to fetch fridge items' }, { status: 500 });
	}

	return json({ items: result.value });
};
