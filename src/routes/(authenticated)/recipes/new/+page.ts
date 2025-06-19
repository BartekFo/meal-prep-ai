import { RecipeFormSchema } from '$lib/modules/recipes/new/schema/index.js';
import { superValidate } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';

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