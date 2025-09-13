import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';
import { essentialInfoSchema } from '$lib/modules/onboarding/schema/essential-info';
import {
  checkOnboardingStatus,
  loadEssentialInfoData,
  saveEssentialInfo,
} from '$lib/modules/onboarding/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;

  // Check onboarding status and redirect if needed
  const statusCheck = checkOnboardingStatus(user);
  if (statusCheck.shouldRedirect && statusCheck.redirectPath) {
    throw redirect(302, statusCheck.redirectPath);
  }

  // Load initial form data
  const initialData = loadEssentialInfoData(user);

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
