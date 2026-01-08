import { building } from '$app/environment';
import { auth } from '$lib/auth';
import { isPublicRoute } from '$lib/utils/onboarding';
import { redirect } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export async function handle({ event, resolve }) {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	const pathname = event.url.pathname;

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	} else {
		if (!isPublicRoute(pathname)) {
			throw redirect(302, '/login');
		}
	}

	return svelteKitHandler({ event, resolve, auth, building });
}
