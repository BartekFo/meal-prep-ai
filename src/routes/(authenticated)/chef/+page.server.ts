import type { PageServerLoad } from './$types';

function isMobileDevice(userAgent: string): boolean {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

export const load: PageServerLoad = async ({ request }) => {
	const userAgent = request.headers.get('user-agent') || '';
	const isMobile = isMobileDevice(userAgent);

	return {
		isMobile
	};
};
