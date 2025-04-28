import { createClient } from "@/lib/supabase/server";
import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";
import { redirect } from "next/navigation";
import { safeParse } from "valibot";
import { onboardingSearchParamsKeys } from "../../search-params";
import { onboardingStepOneFormSchema } from "./schema";
import { formOpts } from "./shared-form-code";
const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    const result = safeParse(onboardingStepOneFormSchema, value);
    if (result.issues && result.issues.length > 0) {
      return result.issues;
    }
  },
});

export default async function saveUserDataAction(
  prev: unknown,
  formData: FormData,
) {
  try {
    const validatedData = await serverValidate(formData);

    const supabase = await createClient();
    const { data, error } = await supabase.auth.updateUser({
      data: {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        date_of_birth: validatedData.dateOfBirth,
        gender: validatedData.gender,
        activity_level: validatedData.activityLevel,
        weight_goal: validatedData.weightGoal,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    redirect(`/onboarding?${onboardingSearchParamsKeys.step}=2`);
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    throw e;
  }
}
