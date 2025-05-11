import { formOptions } from "@tanstack/react-form/nextjs";
import {
  type IOnboardingStepOneFormValues,
  onboardingStepOneFormSchema,
} from "./schema";

const defatultOnboardingStepOneFormValues: IOnboardingStepOneFormValues = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  activityLevel: "",
  weightGoal: "",
};

export const onboardingStepOneFormOpts = formOptions({
  defaultValues: defatultOnboardingStepOneFormValues,
  validators: {
    onSubmit: onboardingStepOneFormSchema,
  },
});
