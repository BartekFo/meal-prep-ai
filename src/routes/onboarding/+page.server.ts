import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';
import { saveEssentialInfo } from '$lib/modules/onboarding/actions/essential-info';
import type { Actions, PageServerLoad } from './$types';
import { essentialInfoSchema } from '$lib/modules/onboarding/schema/essential-info';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(arktype(essentialInfoSchema))
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, arktype(essentialInfoSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// Save the essential info to database
		const result = await saveEssentialInfo(form.data, request);

		if (!result.success) {
			return fail(400, {
				form,
				error: result.errors || 'Failed to save essential information'
			});
		}

		// Redirect to the preferences page
		redirect(302, '/onboarding/preferences');
	}
};
