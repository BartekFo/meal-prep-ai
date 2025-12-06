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
	const allowedRoutes = ['/onboarding', '/onboarding/preferences', '/login', '/sign-up'];

	return allowedRoutes.some((route) => pathname.startsWith(route));
}

export function isPublicRoute(pathname: string): boolean {
	const publicRoutes = ['/login', '/sign-up'];
	// Explicitly list public API routes if needed in the future
	const publicApiRoutes: string[] = [];

	return (
		pathname === '/' ||
		publicRoutes.some((route) => pathname.startsWith(route)) ||
		publicApiRoutes.includes(pathname)
	);
}
