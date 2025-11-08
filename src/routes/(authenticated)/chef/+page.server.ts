import { error } from '@sveltejs/kit';
import { getChatById, getChats } from '$lib/modules/chef/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		error(401, { message: 'User not authenticated' });
	}

	const chatId = url.searchParams.get('chatId');
	const chats = await getChats(locals.user.id);

	let chat = null;
	if (chatId) {
		chat = await getChatById(chatId, locals.user.id);
	}

	return {
		chats,
		chat
	};
};
