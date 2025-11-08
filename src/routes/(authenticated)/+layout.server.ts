import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	// Redirect to login if user is not authenticated
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	return {
		user: locals.user
	};
};
