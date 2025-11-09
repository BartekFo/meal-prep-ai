import { getChats } from '$lib/modules/chef/db/queries';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

function isMobileDevice(userAgent: string): boolean {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

export const load: PageServerLoad = async ({ locals, depends, request }) => {
	if (!locals.user) {
		error(401, { message: 'User not authenticated' });
	}

	depends('chef:chats');

	const chats = await getChats(locals.user.id);
	const userAgent = request.headers.get('user-agent') || '';
	const isMobile = isMobileDevice(userAgent);

	return {
		chats,
		isMobile
	};
};
