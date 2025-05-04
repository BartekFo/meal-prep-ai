import * as v from "valibot";

export const onboardingStepTwoFormSchema = v.object({
  dietaryPreferences: v.array(v.string()),
});

export interface IOnboardingStepTwoFormValues
  extends v.InferOutput<typeof onboardingStepTwoFormSchema> {}
