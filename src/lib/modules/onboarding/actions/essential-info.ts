import { auth } from "$lib/auth";
import type { EssentialInfo } from "../schema/essential-info";

export async function saveEssentialInfo(data: EssentialInfo, request: Request) {
  try {
    const result = await auth.api.updateUser({
      body: {
        firstName: data.firstName,
        lastName: data.lastName,
        weightGoal: data.weightGoal,
        allergies: data.allergies,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender,
        activityLevel: data.activityLevel,
        currentWeight: data.currentWeight,
        height: data.height,
        onboardingStatus: "step1_completed",
      },
      headers: request.headers,
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, errors: "Failed to save essential information" };
  }
}
