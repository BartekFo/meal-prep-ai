import type { MealType } from '$lib/constants/meal-types';
import { getAllRecipes } from '$lib/modules/recipes/db/queries';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.session?.user) {
    error(401, { message: 'User not authenticated' });
  }

  const search = url.searchParams.get('search') || '';
  const type = url.searchParams.get('type') as MealType | undefined;
  const sort = url.searchParams.get('sort') || '';

  const filters = {
    ...(search && { search }),
    ...(type && { type }),
    ...(sort && { sort })
  };

  const recipes = await getAllRecipes(locals.session.user.id, filters);

  return {
    recipes
  };
}; 
