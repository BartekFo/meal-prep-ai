import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";
import { onboardingStepTwoFormSchema } from "./schema";
import { onboardingStepTwoFormOpts } from "./shared-form-code";

const serverValidate = createServerValidate({
  ...onboardingStepTwoFormOpts,
  onServerValidate: onboardingStepTwoFormSchema,
});

export async function saveDietaryPreferencesAction(
  prev: unknown,
  formData: FormData,
) {
  try {
    const validatedData = await serverValidate(formData);
    console.log(validatedData);
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    throw e;
  }
}

export default saveDietaryPreferencesAction;
