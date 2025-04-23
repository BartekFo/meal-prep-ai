"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";
import { safeParse } from "valibot";
import { recipeFormSchema } from "../schema";
import { formOpts } from "./shared-code";

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    const result = safeParse(recipeFormSchema, value);
    if (result.issues) {
      return result.issues;
    }
  },
});

export default async function addRecipeAction(
  prev: unknown,
  formData: FormData,
) {
  try {
    const validatedData = await serverValidate(formData);

    console.log("validatedData", validatedData);
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    throw e;
  }
}
