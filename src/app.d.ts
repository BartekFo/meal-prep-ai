// See https://svelte.dev/docs/kit/types#app.d.ts
import type { OnboardingStatus } from '$lib/types/onboarding';

declare global {
	namespace App {
		interface Locals {
			session?: {
				id: string;
				userId: string;
				expiresAt: Date;
				createdAt: Date;
				updatedAt: Date;
				token: string;
				ipAddress?: string | null | undefined;
				userAgent?: string | null | undefined;
				user?: {
					id: string;
					email: string;
					name: string;
					firstName?: string | null | undefined;
					lastName?: string | null | undefined;
					allergies?: string | null | undefined;
					weightGoal?: string | null | undefined;
					dietaryType?: string | null | undefined;
					dislikedFoods?: string | null | undefined;
					preferredMealTypes?: string[] | null | undefined;
					dietaryPreferences?: string[] | null | undefined;
					dislikedIngredients?: string[] | null | undefined;
					dateOfBirth?: Date | null | undefined;
					gender?: string | null | undefined;
					activityLevel?: string | null | undefined;
					currentWeight?: number | null | undefined;
					height?: number | null | undefined;
					onboardingStatus?: OnboardingStatus | null | undefined;
					onboardingCompletedAt?: Date | null | undefined;
				};
			} | null;
			user?: {
				id: string;
				email: string;
				name: string;
				firstName?: string | null | undefined;
				lastName?: string | null | undefined;
				allergies?: string | null | undefined;
				weightGoal?: string | null | undefined;
				dietaryType?: string | null | undefined;
				dislikedFoods?: string | null | undefined;
				preferredMealTypes?: string[] | null | undefined;
				dietaryPreferences?: string[] | null | undefined;
				dislikedIngredients?: string[] | null | undefined;
				dateOfBirth?: Date | null | undefined;
				gender?: string | null | undefined;
				activityLevel?: string | null | undefined;
				currentWeight?: number | null | undefined;
				height?: number | null | undefined;
				onboardingStatus?: OnboardingStatus | null | undefined;
				onboardingCompletedAt?: Date | null | undefined;
			} | null;
		}
	}
}

export { };
