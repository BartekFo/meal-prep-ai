import { formOptions } from "@tanstack/react-form/nextjs";
import {
  type IOnboardingStepTwoFormValues,
  onboardingStepTwoFormSchema,
} from "./schema";

const defatultOnboardingStepTwoFormValues: IOnboardingStepTwoFormValues = {
  dietaryPreferences: [],
};

export const onboardingStepTwoFormOpts = formOptions({
  defaultValues: defatultOnboardingStepTwoFormValues,
  validators: {
    onSubmit: onboardingStepTwoFormSchema,
  },
});
