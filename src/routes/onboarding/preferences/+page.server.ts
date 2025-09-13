import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';
import { saveFoodPreferences } from '$lib/modules/onboarding/actions/food-preferences';
import type { DietaryType } from '$lib/modules/onboarding/constants';
import { foodPreferencesSchema } from '$lib/modules/onboarding/schema/food-preferences';
import type { OnboardingStatus } from '$lib/types/onboarding';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;

  const onboardingStatus = user?.onboardingStatus as OnboardingStatus;
  if (!onboardingStatus || onboardingStatus === 'not_started') {
    throw redirect(302, '/onboarding');
  }

  const initialData = {
    dietaryType: (user?.dietaryType as DietaryType) || '',
    dislikedFoods: user?.dislikedFoods || '',
    preferredMealTypes: user?.preferredMealTypes || [],
  };

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
