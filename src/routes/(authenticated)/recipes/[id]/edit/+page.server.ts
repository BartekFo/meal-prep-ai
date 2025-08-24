import { superValidate, withFiles } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { RecipeFormSchema } from '$lib/modules/recipes/new/schema';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { auth } from '$lib/auth';
import { updateRecipe } from '$lib/modules/recipes/edit/actions';
import { getRecipeById } from '$lib/modules/recipes/db/queries';
import { error } from '@sveltejs/kit';

const defaults = {
	title: '',
	description: '',
	image: undefined,
	prepTime: 0,
	cookTime: 0,
	servings: 0,
	mealType: 'breakfast' as const,
	calories: 0,
	protein: 0,
	carbs: 0,
	fat: 0,
	ingredients: [''],
	instructions: ['']
};

export const load: ServerLoad = async ({ params, request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session?.user) {
		throw redirect(303, '/login');
	}

	const recipeId = parseInt(params.id!);
	if (isNaN(recipeId)) {
		throw error(404, 'Recipe not found');
	}

	const existingRecipe = await getRecipeById(recipeId, session.user.id);
	if (!existingRecipe) {
		throw error(404, 'Recipe not found');
	}

	const recipeData = {
		...existingRecipe,
		description: existingRecipe.description ?? undefined
	};

	const form = await superValidate(recipeData, arktype(RecipeFormSchema, { defaults }));

	return { form, recipe: existingRecipe };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const form = await superValidate(request, arktype(RecipeFormSchema, { defaults }));

		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user) {
			throw redirect(303, '/login');
		}

		const recipeId = parseInt(params.id!);
		if (isNaN(recipeId)) {
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
