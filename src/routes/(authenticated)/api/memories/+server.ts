import { getAllMemories, saveMemory } from '$lib/server/memory';
import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const memories = await getAllMemories(locals.user.id);
		return json({ memories });
	} catch (error) {
		console.error('Error fetching memories:', error);
		return json({ error: 'Failed to fetch memories' }, { status: 500 });
	}
}

export async function POST({ request, locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { content, metadata } = await request.json();

		if (!content || typeof content !== 'string' || content.trim() === '') {
			return json({ error: 'Content is required' }, { status: 400 });
		}

		await saveMemory(locals.user.id, content.trim(), {
			...metadata,
			source: 'manual',
			type: 'user_added'
		});

		return json({ success: true });
	} catch (error) {
		console.error('Error adding memory:', error);
		return json({ error: 'Failed to add memory' }, { status: 500 });
	}
}
