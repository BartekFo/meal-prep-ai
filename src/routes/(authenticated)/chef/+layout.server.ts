import { getChatsByUserId } from '$lib/modules/chef/db/queries';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { user } }) => {
	if (!user) {
		throw redirect(302, '/login');
	}

	const chats = await getChatsByUserId({ id: user.id }).match(
		(chats) => chats,
		() => error(500, 'An error occurred while processing your request')
	);

	return {
		chats
	};
};
