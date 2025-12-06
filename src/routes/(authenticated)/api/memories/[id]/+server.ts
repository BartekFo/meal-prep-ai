import { deleteMemory, getAllMemories } from '$lib/server/memory';
import { json } from '@sveltejs/kit';

export async function DELETE({ params, locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = params;

	if (!id) {
		return json({ error: 'Memory ID is required' }, { status: 400 });
	}

	// Verify ownership before deletion
	const memoriesResult = await getAllMemories(locals.user.id);

	if (memoriesResult.isErr()) {
		return json({ error: 'Failed to fetch memories' }, { status: 500 });
	}

	const memoryExists = memoriesResult.value.some(
		(m: { id: string; memory: string }) => m.id === id
	);

	if (!memoryExists) {
		return json({ error: 'Memory not found' }, { status: 404 });
	}

	const result = await deleteMemory(id);

	if (result.isErr()) {
		console.error('Error deleting memory:', result.error);
		return json({ error: 'Failed to delete memory' }, { status: 500 });
	}

	return json({ success: true });
}
