import { redirect } from '@sveltejs/kit';
import { getOnboardingRedirectPath } from '$lib/utils/onboarding';
import type { OnboardingStatus } from '$lib/types/onboarding';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// If user is logged in, redirect based on onboarding status
	if (locals.user) {
		const onboardingStatus = locals.user.onboardingStatus as OnboardingStatus;
		const redirectPath = getOnboardingRedirectPath(onboardingStatus);
		
		if (redirectPath) {
			throw redirect(302, redirectPath);
		} else {
			// Onboarding is complete, redirect to dashboard
			throw redirect(302, '/dashboard');
		}
	}
	
	// User is not logged in, redirect to login
	throw redirect(302, '/login');
};