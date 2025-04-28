import * as v from "valibot";

export const onboardingStepOneFormSchema = v.object({
  firstName: v.string(),
  lastName: v.string(),
  avatar: v.optional(v.blob()),
  dateOfBirth: v.optional(v.date()),
  gender: v.optional(v.string()),
  activityLevel: v.string(),
  weightGoal: v.string(),
});

export interface IOnboardingStepOneFormValues
  extends v.InferOutput<typeof onboardingStepOneFormSchema> {}
