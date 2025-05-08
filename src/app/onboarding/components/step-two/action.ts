"use server";
import { createClient } from "@/lib/supabase/server";
import { convertObjectToArray } from "@/lib/utils/convertObjectToArray";
import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";
import { redirect } from "next/navigation";
import { safeParse } from "valibot";
import { onboardingSearchParamsKeys } from "../../search-params";
import { onboardingStepTwoFormSchema } from "./schema";
import { onboardingStepTwoFormOpts } from "./shared-form-code";

const serverValidate = createServerValidate({
  ...onboardingStepTwoFormOpts,
  onServerValidate: ({ value }) => {
    if (
      value.dietaryPreferences &&
      typeof value.dietaryPreferences === "object" &&
      !Array.isArray(value.dietaryPreferences)
    ) {
      value.dietaryPreferences = convertObjectToArray<string>(
        value.dietaryPreferences as Record<string, string>,
      );
    }

    const result = safeParse(onboardingStepTwoFormSchema, value);
    if (result.issues && result.issues.length > 0) {
      return result.issues;
    }
    return null;
  },
});

export async function saveDietaryPreferencesAction(
  prev: unknown,
  formData: FormData,
) {
  try {
    const validatedData = await serverValidate(formData);

    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        dietary_preferences: validatedData.dietaryPreferences,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    redirect(`/onboarding?${onboardingSearchParamsKeys.step}=3`);
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    throw e;
  }
}

export default saveDietaryPreferencesAction;
