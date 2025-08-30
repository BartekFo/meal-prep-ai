import { redirect } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import { auth } from '$lib/auth';
import type { OnboardingStatus } from '$lib/types/onboarding';
import {
  getOnboardingRedirectPath,
  isAllowedRoute,
} from '$lib/utils/onboarding';

export async function handle({ event, resolve }) {
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;

    // Handle onboarding redirect logic for authenticated users
    const user = session.user;
    const pathname = event.url.pathname;
    const onboardingStatus = user.onboardingStatus as OnboardingStatus;

    // Skip redirect for allowed routes
    if (!isAllowedRoute(pathname)) {
      const redirectPath = getOnboardingRedirectPath(onboardingStatus);
      if (redirectPath && redirectPath !== pathname) {
        throw redirect(302, redirectPath);
      }
    }
  }

  return svelteKitHandler({ event, resolve, auth, building });
}
