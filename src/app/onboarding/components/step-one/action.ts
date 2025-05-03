"use server";

import { uploadImageToSupabase } from "@/lib/supabase/image-upload";
import { createClient } from "@/lib/supabase/server";
import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";
import { redirect } from "next/navigation";
import { onboardingSearchParamsKeys } from "../../search-params";
import { onboardingStepOneFormSchema } from "./schema";
import { onboardingStepOneFormOpts } from "./shared-form-code";

const serverValidate = createServerValidate({
  ...onboardingStepOneFormOpts,
  onServerValidate: onboardingStepOneFormSchema,
});

export default async function saveUserDataAction(
  prev: unknown,
  formData: FormData,
) {
  try {
    const validatedData = await serverValidate(formData);

    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();

    const userId = userData.user?.id;

    if (!userId) throw new Error("User not authenticated");

    const imageUrl = await uploadImageToSupabase({
      imageFile: validatedData.avatar,
      userId,
      bucketName: "avatars",
    });

    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        date_of_birth: validatedData.dateOfBirth,
        gender: validatedData.gender,
        activity_level: validatedData.activityLevel,
        weight_goal: validatedData.weightGoal,
        avatar_url: imageUrl,
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
