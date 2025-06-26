import { auth } from "$lib/auth";

export async function saveDislikedIngredients(data: any) {
  try {
    const result = await auth.api.updateUser({
      body: {
        dislikedIngredients: data.dislikedIngredients || []
      }
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving disliked ingredients:', error);
    return { success: false, errors: 'Failed to save disliked ingredients' };
  }
} 
