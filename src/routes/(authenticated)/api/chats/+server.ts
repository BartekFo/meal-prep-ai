import { json } from '@sveltejs/kit';
import { createChat } from '$lib/modules/chef/db/queries';

export async function POST({ request, locals }) {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { title }: { title?: string } = await request.json();
	const chatTitle = title || 'New Chat';

	const chat = await createChat(locals.user.id, chatTitle);
	return json({ chatId: chat.id, chat });
}
