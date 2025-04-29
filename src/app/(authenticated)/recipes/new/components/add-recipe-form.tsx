"use client";

import Link from "next/link";

import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { useStore, useTransform } from "@tanstack/react-form";
import { initialFormState, mergeForm } from "@tanstack/react-form/nextjs";
import { useActionState } from "react";
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

  console.log("formErrors", formErrors);

  return (
    <form
      action={action as never}
      onSubmit={() => {
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      {/* {formErrors && Object.values(formErrors).map((error) => (
        <p key={error[0].message}>{error[0].message}</p>
      ))} */}
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
