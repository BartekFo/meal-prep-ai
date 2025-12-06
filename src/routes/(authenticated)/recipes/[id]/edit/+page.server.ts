import { auth } from '$lib/auth';
import type { MealType } from '$lib/constants/meal-types';
import { getRecipeById } from '$lib/modules/recipes/db/queries';
import { updateRecipe } from '$lib/modules/recipes/edit/actions';
import { RecipeFormSchema } from '$lib/modules/recipes/new/schema';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: ServerLoad = async ({ params, request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session?.user) {
		throw redirect(303, '/login');
	}

	if (!params.id) {
		throw error(404, 'Recipe not found');
	}

	const recipeId = Number.parseInt(params.id, 10);
	if (Number.isNaN(recipeId)) {
		throw error(404, 'Recipe not found');
	}

	const existingRecipe = await getRecipeById(recipeId, session.user.id);
	if (!existingRecipe) {
		throw error(404, 'Recipe not found');
	}

	const recipeData = {
		...existingRecipe,
		description: existingRecipe.description ?? undefined,
		mealType: existingRecipe.mealType as MealType
	};

	const form = await superValidate(recipeData, zod4(RecipeFormSchema));

	return { form, recipe: existingRecipe };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
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

		if (!params.id) {
			throw error(404, 'Recipe not found');
		}

		const recipeId = Number.parseInt(params.id, 10);
		if (Number.isNaN(recipeId)) {
			throw error(404, 'Recipe not found');
		}

		const result = await updateRecipe({
			id: recipeId,
			formData: form.data,
			userId: session.user.id
		});

		if (result.isErr()) {
			return error(500, {
				message: result.error.message
			});
		}

		redirect(303, `/recipes/${recipeId}`);
	}
};
