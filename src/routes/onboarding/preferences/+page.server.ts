import { fail, redirect } from '@sveltejs/kit';
import { saveFoodPreferences } from '$lib/modules/onboarding/actions/food-preferences';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const dietaryType = data.get('dietaryType')?.toString() || '';

		// Validate dietaryType is one of the allowed values
		if (!['omnivore', 'vegetarian', 'vegan'].includes(dietaryType)) {
			return fail(400, {
				error: 'Invalid dietary type'
			});
		}

		const formData = {
			dietaryType: dietaryType as 'omnivore' | 'vegetarian' | 'vegan',
			dislikedFoods: data.get('dislikedFoods')?.toString() || '',
			preferredMealTypes: data.getAll('preferredMealTypes') as string[]
		};

		// Save the food preferences to database
		const result = await saveFoodPreferences(formData);

		if (!result.success) {
			return fail(400, {
				error: result.errors || 'Failed to save food preferences'
			});
		}

		// Redirect to dashboard after completing onboarding
		redirect(302, '/dashboard');
	}
};
