import { superValidate, message, withFiles } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { RecipeFormSchema } from '$lib/modules/recipes/new/schema';
import type { Actions } from '@sveltejs/kit';

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
  ingredients: [],
  instructions: [],
};

export const load = async () => {
  const form = await superValidate(arktype(RecipeFormSchema, { defaults }));

  return { form };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, arktype(RecipeFormSchema, { defaults }));
    console.log('Form data received:', form);

    if (!form.valid) {
      return fail(400, withFiles({ form }));
    }

    // TODO: Implement database logic
    // - Save recipe to database using Drizzle ORM
    // - Handle image upload (store file, get URL)
    // - Return success response or redirect

    try {
      // TODO: Add database save logic here
      console.log('Validated form data:', form.data);

      // For now, just simulate success
      return message(form, 'Recipe created successfully!');
    } catch (error) {
      console.error('Error creating recipe:', error);
      return fail(500, withFiles({
        form,
        message: 'An error occurred while creating the recipe'
      }));
    }
  }
}; 
