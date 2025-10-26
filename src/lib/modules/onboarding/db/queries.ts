import type { User } from "$lib/types/auth";
import type { OnboardingStatus } from "$lib/types/onboarding";
import type { DietaryType, WeightGoal } from "../constants";

/**
 * Prepares initial form data for essential info step of onboarding
 */
export function loadEssentialInfoData(user: User | null | undefined) {
  if (!user) {
    return null;
  }

  const onboardingStatus = user.onboardingStatus as OnboardingStatus;

  // Return null for users who haven't started onboarding
  if (onboardingStatus === "not_started") {
    return null;
  }

  // Return user data for users who have started onboarding
  return {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    allergies: user.allergies || "",
    weightGoal: (user.weightGoal as WeightGoal) || "",
    dateOfBirth: user.dateOfBirth?.toISOString().split("T")[0] || "",
    gender: user.gender || "",
    activityLevel: user.activityLevel || "",
    currentWeight: user.currentWeight || 0,
    height: user.height || 0,
  };
}

/**
 * Prepares initial form data for food preferences step of onboarding
 */
export function loadFoodPreferencesData(user: User | null | undefined) {
  if (!user) {
    return {
      dietaryType: "" as DietaryType,
      dislikedFoods: "",
      preferredMealTypes: [],
    };
  }

  return {
    dietaryType: (user.dietaryType as DietaryType) || "omnivore",
    dislikedFoods: user.dislikedFoods || "",
    preferredMealTypes: user.preferredMealTypes || [],
  };
}

/**
 * Checks onboarding status and determines appropriate redirect
 */
export function checkOnboardingStatus(user: User | null | undefined): {
  shouldRedirect: boolean;
  redirectPath?: string;
} {
  if (!user) {
    return { shouldRedirect: false };
  }

  const onboardingStatus = user.onboardingStatus as OnboardingStatus;

  if (onboardingStatus === "completed") {
    return { shouldRedirect: true, redirectPath: "/dashboard" };
  }

  if (onboardingStatus === "step1_completed") {
    return { shouldRedirect: true, redirectPath: "/onboarding/preferences" };
  }

  return { shouldRedirect: false };
}

/**
 * Validates if user can access preferences step
 */
export function canAccessPreferences(user: User | null | undefined): boolean {
  if (!user) {
    return false;
  }

  const onboardingStatus = user.onboardingStatus as OnboardingStatus;
  return onboardingStatus !== "not_started" && onboardingStatus !== null;
}
