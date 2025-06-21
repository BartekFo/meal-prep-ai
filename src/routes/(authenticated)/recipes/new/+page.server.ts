import { superValidate, message, withFiles } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { RecipeFormSchema } from '$lib/modules/recipes/new/schema';
import type { Actions } from '@sveltejs/kit';
import { createStorage } from '$lib/storage';
import { auth } from '$lib/auth';

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
  instructions: [''],
};

export const load = async () => {
  const form = await superValidate(arktype(RecipeFormSchema, { defaults }));

  return { form };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, arktype(RecipeFormSchema, { defaults }));
    console.log('Form data received:', form);

    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!form.valid) {
      console.log('Form is invalid:', form.errors);
      return fail(400, withFiles({ form }));
    }

    try {
      let imageUrl = null;

      if (form.data.image && form.data.image.size > 0) {
        const storage = createStorage();
        const userId = session?.user?.id;
        const filename = `${Date.now()}-${form.data.image.name}`;
        const imagePath = `recipes/${userId}/${filename}`;

        imageUrl = await storage.upload(form.data.image, imagePath);
      }

      console.log('Validated form data:', { ...form.data, imageUrl });

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
