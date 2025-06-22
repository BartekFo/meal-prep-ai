import type { SaveDietaryPreferencesData } from '../db/types';

export async function saveDietaryPreferences(data: any, userId: string) {
  try {

    const saveData: SaveDietaryPreferencesData = {
      userId,
      dietaryPreferences: data.dietaryPreferences || []
    };

    const result = await dbSaveDietaryPreferences(saveData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving dietary preferences:', error);
    return { success: false, errors: 'Failed to save dietary preferences' };
  }
} 
