import { auth } from '$lib/auth';

interface FoodPreferencesData {
	dietaryType: 'omnivore' | 'vegetarian' | 'vegan';
	dislikedFoods: string;
	preferredMealTypes: string[];
}

export async function saveFoodPreferences(data: FoodPreferencesData) {
	try {
		// Basic validation
		if (!data.dietaryType || !data.preferredMealTypes || data.preferredMealTypes.length === 0) {
			return {
				success: false,
				errors: 'Dietary type and at least one preferred meal type are required'
			};
		}

		const result = await auth.api.updateUser({
			body: {
				dietaryType: data.dietaryType,
				dislikedFoods: data.dislikedFoods,
				preferredMealTypes: data.preferredMealTypes
			}
		});

		return { success: true, data: result };
	} catch (error) {
		console.error('Error saving food preferences:', error);
		return { success: false, errors: 'Failed to save food preferences' };
	}
}
