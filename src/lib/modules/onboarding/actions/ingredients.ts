import type { SaveDislikedIngredientsData } from '../db/types';

export async function saveDislikedIngredients(data: any, userId: string) {
  try {
    const saveData: SaveDislikedIngredientsData = {
      userId,
      dislikedIngredients: data.dislikedIngredients || []
    };

    const result = await dbSaveDislikedIngredients(saveData);

    // Complete onboarding process
    await completeOnboarding(userId);

    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving disliked ingredients:', error);
    return { success: false, errors: 'Failed to save disliked ingredients' };
  }
} 
