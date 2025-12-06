import { auth } from '$lib/auth';
import { createRecipe } from '$lib/modules/recipes/new/actions';
import { RecipeFormSchema } from '$lib/modules/recipes/new/schema';
import type { Actions } from '@sveltejs/kit';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod4(RecipeFormSchema));

	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(RecipeFormSchema));

		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user) {
			throw redirect(303, '/login');
		}

		const result = await createRecipe({
			formData: form.data,
			userId: session.user.id
		});

		if (result.isErr()) {
			return error(500, {
				message: result.error.message
			});
		}

		redirect(303, '/recipes');
	}
};
