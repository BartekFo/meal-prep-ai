import { savePersonalInfo } from '$lib/modules/onboarding/actions/personal-info';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    const result = await savePersonalInfo(data);

    if (!result.success) {
      return fail(400, { message: result.errors });
    }

    redirect(302, '/onboarding/manual/step-2');
  }
}; 
