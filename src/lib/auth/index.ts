import { db } from "../server/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
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
      weightGoal: {
        type: 'string',
        required: false
      },
      dietaryPreferences: {
        type: 'string[]',
        required: false
      },
      dislikedIngredients: {
        type: 'string[]',
        required: false
      }

    }
  }
})
