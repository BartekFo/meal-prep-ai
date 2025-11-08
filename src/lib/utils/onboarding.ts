import type { OnboardingStatus } from '$lib/types/onboarding';

export function getOnboardingRedirectPath(
	status: OnboardingStatus | null | undefined
): string | null {
	if (!status || status === 'not_started') {
		return '/onboarding';
	}

	if (status === 'step1_completed') {
		return '/onboarding/preferences';
	}

	return null;
}

export function isOnboardingComplete(status: OnboardingStatus | null | undefined): boolean {
	return status === 'completed';
}

export function isOnboardingRoute(pathname: string): boolean {
	return pathname.startsWith('/onboarding');
}

export function isAuthRoute(pathname: string): boolean {
	return pathname.startsWith('/login') || pathname.startsWith('/sign-up');
}

export function isAllowedRoute(pathname: string): boolean {
	const allowedRoutes = ['/onboarding', '/onboarding/preferences', '/api', '/login', '/sign-up'];

	return allowedRoutes.some((route) => pathname.startsWith(route));
}
