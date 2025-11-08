import { error } from '@sveltejs/kit';
import { getChatById, getChats } from '$lib/modules/chef/db/queries';
import type { PageServerLoad } from './$types';

function isMobileDevice(userAgent: string): boolean {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

export const load: PageServerLoad = async ({ locals, params, depends, request }) => {
	if (!locals.user) {
		error(401, { message: 'User not authenticated' });
	}

	depends('chef:chats');

	const chatId = params.chatId;
	const chats = await getChats(locals.user.id);
	const userAgent = request.headers.get('user-agent') || '';
	const isMobile = isMobileDevice(userAgent);

	const chat = await getChatById(chatId, locals.user.id);

	if (!chat) {
		error(404, { message: 'Chat not found' });
	}

	return {
		chats,
		chat,
		isMobile
	};
};
