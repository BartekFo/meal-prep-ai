import { json } from '@sveltejs/kit';
import { deleteChat } from '$lib/modules/chef/db/queries';

export async function DELETE({ params, locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const deleted = await deleteChat(params.id, locals.user.id);

	if (!deleted) {
		return json({ error: 'Chat not found' }, { status: 404 });
	}

	return json({ success: true });
}
