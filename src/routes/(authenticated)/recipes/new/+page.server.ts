import type { Actions } from "@sveltejs/kit";
import { error, fail, redirect } from "@sveltejs/kit";
import { superValidate, withFiles } from "sveltekit-superforms";
import { arktype } from "sveltekit-superforms/adapters";
import { auth } from "$lib/auth";
import { createRecipe } from "$lib/modules/recipes/new/actions";
import { RecipeFormSchema } from "$lib/modules/recipes/new/schema";

const defaults = {
  title: "",
  description: "",
  image: undefined,
  prepTime: 0,
  cookTime: 0,
  servings: 0,
  mealType: "breakfast" as const,
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  ingredients: [""],
  instructions: [""],
};

export const load = async () => {
  const form = await superValidate(arktype(RecipeFormSchema, { defaults }));

  return { form };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(
      request,
      arktype(RecipeFormSchema, { defaults })
    );

    if (!form.valid) {
      return fail(400, withFiles({ form }));
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      throw redirect(303, "/login");
    }

    const result = await createRecipe({
      formData: form.data,
      userId: session.user.id,
    });

    if (result.isErr()) {
      return error(500, {
        message: result.error.message,
      });
    }

    redirect(303, "/recipes");
  },
};
