import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';
import { foodPreferencesSchema } from '$lib/modules/onboarding/schema/food-preferences';
import {
  canAccessPreferences,
  loadFoodPreferencesData,
  saveFoodPreferences,
} from '$lib/modules/onboarding/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;

  // Check if user can access preferences step
  if (!canAccessPreferences(user)) {
    throw redirect(302, '/onboarding');
  }

  // Load initial form data
  const initialData = loadFoodPreferencesData(user);

  return {
    form: await superValidate(initialData, arktype(foodPreferencesSchema)),
  };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, arktype(foodPreferencesSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const result = await saveFoodPreferences(form.data, request);

    if (!result.success) {
      return fail(400, {
        form,
        error: result.errors || 'Failed to save food preferences',
      });
    }

    redirect(302, '/dashboard');
  },
};
