// See https://svelte.dev/docs/kit/types#app.d.ts
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
			} | null;
		}
	}
}

export {};
