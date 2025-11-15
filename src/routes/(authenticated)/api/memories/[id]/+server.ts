import { deleteMemory } from '$lib/server/memory';
import { json } from '@sveltejs/kit';

export async function DELETE({ params, locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = params;

	if (!id) {
		return json({ error: 'Memory ID is required' }, { status: 400 });
	}

	try {
		const success = await deleteMemory(id);

		if (!success) {
			return json({ error: 'Failed to delete memory' }, { status: 500 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting memory:', error);
		return json({ error: 'Failed to delete memory' }, { status: 500 });
	}
}
