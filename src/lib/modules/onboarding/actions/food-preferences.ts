import { auth } from "$lib/auth";
import type { DietaryType } from "../constants";

type FoodPreferencesData = {
  dietaryType: DietaryType;
  dislikedFoods: string;
  preferredMealTypes: string[];
};

export async function saveFoodPreferences(
  data: FoodPreferencesData,
  request: Request
) {
  try {
    const result = await auth.api.updateUser({
      body: {
        dietaryType: data.dietaryType,
        dislikedFoods: data.dislikedFoods,
        preferredMealTypes: data.preferredMealTypes,
        onboardingStatus: "completed",
        onboardingCompletedAt: new Date(),
      },
      headers: request.headers,
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, errors: "Failed to save food preferences" };
  }
}
