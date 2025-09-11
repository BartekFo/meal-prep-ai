import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';
import { saveEssentialInfo } from '$lib/modules/onboarding/actions/essential-info';
import type { WeightGoal } from '$lib/modules/onboarding/constants';
import { essentialInfoSchema } from '$lib/modules/onboarding/schema/essential-info';
import type { OnboardingStatus } from '$lib/types/onboarding';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;

  // Redirect users who have already completed onboarding
  const onboardingStatus = user?.onboardingStatus as OnboardingStatus;
  if (onboardingStatus === 'completed') {
    throw redirect(302, '/dashboard');
  }

  // Redirect users who completed step 1 to preferences
  if (onboardingStatus === 'step1_completed') {
    throw redirect(302, '/onboarding/preferences');
  }

  const initialData =
    onboardingStatus === 'not_started'
      ? null
      : {
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          allergies: user?.allergies || '',
          weightGoal: (user?.weightGoal as WeightGoal) || '',
          dateOfBirth: user?.dateOfBirth?.toISOString().split('T')[0] || '',
          gender: user?.gender || '',
          activityLevel: user?.activityLevel || '',
          currentWeight: user?.currentWeight || 0,
          height: user?.height || 0,
        };

  return {
    form: await superValidate(initialData, arktype(essentialInfoSchema)),
  };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, arktype(essentialInfoSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    const result = await saveEssentialInfo(form.data, request);

    if (!result.success) {
      return fail(400, {
        form,
        error: result.errors || 'Failed to save essential information',
      });
    }

    redirect(302, '/onboarding/preferences');
  },
};
