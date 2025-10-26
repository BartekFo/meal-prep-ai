import { error } from "@sveltejs/kit";
import { getRecipeById } from "$lib/modules/recipes/db/queries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user) {
    error(401, "User not authenticated");
  }

  const recipeId = Number(params.id);
  if (Number.isNaN(recipeId)) {
    error(400, "Invalid recipe ID");
  }

  const recipe = await getRecipeById(recipeId, locals.user.id);

  if (!recipe) {
    error(404, "Recipe not found");
  }

  return {
    recipe,
  };
};
