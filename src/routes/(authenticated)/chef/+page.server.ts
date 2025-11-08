import { error } from '@sveltejs/kit';
import { getChatById, getChats } from '$lib/modules/chef/db/queries';
import type { PageServerLoad } from './$types';

function isMobileDevice(userAgent: string): boolean {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

export const load: PageServerLoad = async ({ locals, url, depends, request }) => {
	if (!locals.user) {
		error(401, { message: 'User not authenticated' });
	}

	depends('chef:chats');

	const chatId = url.searchParams.get('chatId');
	const chats = await getChats(locals.user.id);
	const userAgent = request.headers.get('user-agent') || '';
	const isMobile = isMobileDevice(userAgent);

	let chat = null;
	if (chatId) {
		chat = await getChatById(chatId, locals.user.id);
	}

	return {
		chats,
		chat,
		isMobile
	};
};
