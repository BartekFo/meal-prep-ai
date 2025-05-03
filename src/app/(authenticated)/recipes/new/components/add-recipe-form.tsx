"use client";

import Link from "next/link";

import { useAppForm } from "@/components/form";
import { Heading3 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useStore, useTransform } from "@tanstack/react-form";
import { initialFormState, mergeForm } from "@tanstack/react-form/nextjs";
import { useActionState } from "react";
import { isServerSideErrors } from "../../../../../lib/type-guards/form-error-types";
import addRecipeAction from "../form-logic/action";
import { recipeFormOpts } from "../form-logic/shared-form-code";
import { IngredientsFields } from "./ingredients-fields";
import { InstructionsFields } from "./instructions-fields";
import { NutritionInformationFields } from "./nutrition-information-fields";
import { RecipeDetailsFields } from "./recipe-details-fields";

export function AddRecipeForm() {
  const [state, action] = useActionState(addRecipeAction, initialFormState);

  const form = useAppForm({
    ...recipeFormOpts,
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, state ?? {}),
      [state],
    ),
  });

  const formErrors = useStore(form.store, (formState) => formState.errors)[0];

  return (
    <form action={action} onSubmit={form.handleSubmit} className="space-y-8">
      {isServerSideErrors(formErrors) && formErrors.length > 0 && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-destructive">
          <Heading3>Validation Errors:</Heading3>
          <ul className="ml-4 list-disc space-y-1 pt-2 text-sm">
            {formErrors.map((error, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static list of errors
              <li key={index}>{error?.message}</li>
            ))}
          </ul>
        </div>
      )}
      <RecipeDetailsFields form={form} />
      <NutritionInformationFields form={form} />
      <IngredientsFields form={form} />
      <InstructionsFields form={form} />

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" asChild>
          <Link href="/recipes">Cancel</Link>
        </Button>
        <form.AppForm>
          <form.SubmitButton>Save Recipe</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
}
