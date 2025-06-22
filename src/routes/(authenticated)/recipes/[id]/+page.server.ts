import { getRecipeById } from '$lib/modules/recipes/db/queries';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.session?.user) {
    error(401, 'User not authenticated');
  }

  const recipeId = Number(params.id);
  if (isNaN(recipeId)) {
    error(400, 'Invalid recipe ID');
  }

  const recipe = await getRecipeById(recipeId, locals.session.user.id);

  if (!recipe) {
    error(404, 'Recipe not found');
  }

  return {
    recipe
  };
}; 
