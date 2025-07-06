import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';
import { personalInfoSchema } from '$lib/modules/onboarding/schema/personal-info';
import type { PageServerLoad, Actions } from './$types';

const defaults = {
  dateOfBirth: '',
  gender: 'male' as const
};

export const load: PageServerLoad = async ({ cookies }) => {
  const onboardingData = cookies.get('onboarding_data');
  const data = onboardingData ? JSON.parse(onboardingData) : {};
  const form = await superValidate(data, arktype(personalInfoSchema, { defaults }));
  return { form };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, arktype(personalInfoSchema, { defaults }));
    if (!form.valid) {
      return fail(400, { form });
    }

    const existingData = cookies.get('onboarding_data');
    const oldData = existingData ? JSON.parse(existingData) : {};
    const newData = { ...oldData, ...form.data };

    cookies.set('onboarding_data', JSON.stringify(newData), {
      path: '/onboarding/manual',
      maxAge: 60 * 60 // 1 hour
    });

    throw redirect(303, '/onboarding/manual/step-2');
  }
}; 
