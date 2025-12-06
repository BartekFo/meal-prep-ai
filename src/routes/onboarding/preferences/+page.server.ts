import { foodPreferencesSchema } from '$lib/modules/onboarding/schema/food-preferences';
import {
	canAccessPreferences,
	loadFoodPreferencesData,
	saveFoodPreferences
} from '$lib/modules/onboarding/server';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (!canAccessPreferences(user)) {
		throw redirect(302, '/onboarding');
	}

	const initialData = loadFoodPreferencesData(user);

	return {
		form: await superValidate(initialData, zod4(foodPreferencesSchema))
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(foodPreferencesSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const result = await saveFoodPreferences(form.data, request);

		if (!result.success) {
			return fail(400, {
				form,
				error: result.errors || 'Failed to save food preferences'
			});
		}

		redirect(302, '/dashboard');
	}
};
