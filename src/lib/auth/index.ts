import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db } from '../server/db';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	plugins: [sveltekitCookies(getRequestEvent)],
	emailAndPassword: {
		enabled: true
	},
	user: {
		additionalFields: {
			firstName: {
				type: 'string',
				required: false
			},
			lastName: {
				type: 'string',
				required: false
			},
			allergies: {
				type: 'string',
				required: false
			},
			weightGoal: {
				type: 'string',
				required: false
			},
			dietaryType: {
				type: 'string',
				required: false
			},
			preferredMealTypes: {
				type: 'string[]',
				required: false
			},
			dislikedFoods: {
				type: 'string',
				required: false
			},
			dateOfBirth: {
				type: 'date',
				required: false
			},
			gender: {
				type: 'string',
				required: false
			},
			activityLevel: {
				type: 'string',
				required: false
			},
			currentWeight: {
				type: 'number',
				required: false
			},
			height: {
				type: 'number',
				required: false
			},
			onboardingStatus: {
				type: 'string',
				required: false
			},
			onboardingCompletedAt: {
				type: 'date',
				required: false
			}
		}
	}
});
