import { auth } from '$lib/auth';

export async function saveDietaryPreferences(data: any,) {
  try {
    const result = await auth.api.updateUser({
      body: {
        dietaryPreferences: data.dietaryPreferences || []
      }
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving dietary preferences:', error);
    return { success: false, errors: 'Failed to save dietary preferences' };
  }
} 
