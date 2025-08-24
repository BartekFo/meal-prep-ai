import { fail, redirect } from '@sveltejs/kit';
import { saveFoodPreferences } from '$lib/modules/onboarding/actions/food-preferences';
import type { Actions, PageServerLoad } from './$types';
import { DIETARY_TYPES, type DietaryType } from '$lib/modules/onboarding/constants';
import type { OnboardingStatus } from '$lib/types/onboarding';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	
	// Ensure user has completed step 1 before accessing preferences
	const onboardingStatus = user?.onboardingStatus as OnboardingStatus;
	if (!onboardingStatus || onboardingStatus === 'not_started') {
		throw redirect(302, '/onboarding');
	}

	return {
		user: {
			dietaryType: user?.dietaryType || '',
			dislikedFoods: user?.dislikedFoods || '',
			preferredMealTypes: user?.preferredMealTypes || []
		}
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const dietaryType = data.get('dietaryType')?.toString() || '';

		const allowedDietaryTypes = DIETARY_TYPES.map((type) => type.value);
		if (!allowedDietaryTypes.includes(dietaryType as DietaryType)) {
			return fail(400, {
				error: 'Invalid dietary type'
			});
		}

		const formData = {
			dietaryType: dietaryType as DietaryType,
			dislikedFoods: data.get('dislikedFoods')?.toString() || '',
			preferredMealTypes: data.getAll('preferredMealTypes') as string[]
		};

		const result = await saveFoodPreferences(formData, request);

		if (!result.success) {
			return fail(400, {
				error: result.errors || 'Failed to save food preferences'
			});
		}

		redirect(302, '/dashboard');
	}
};
