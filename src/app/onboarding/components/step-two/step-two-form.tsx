"use client";

import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tables } from "@/lib/supabase/database.types";
import { useStore, useTransform } from "@tanstack/react-form";
import { initialFormState, mergeForm } from "@tanstack/react-form/nextjs";
import Link from "next/link";
import { useActionState } from "react";
import saveDietaryPreferencesAction from "./action";
import { DietaryPreferenceOption } from "./dietary-preference-option";
import { onboardingStepTwoFormOpts } from "./shared-form-code";

type StepTwoFormProps = {
  dietaryOptions: Array<Tables<"dietary_options">>;
};

export function StepTwoForm({ dietaryOptions }: StepTwoFormProps) {
  const [state, action] = useActionState(
    saveDietaryPreferencesAction,
    initialFormState,
  );

  const form = useAppForm({
    ...onboardingStepTwoFormOpts,
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, state ?? {}),
      [state],
    ),
  });
  const formErrors = useStore(form.store, (formState) => formState.errors)[0];

  console.log(formErrors);

  return (
    <form action={action} onSubmit={form.handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <form.AppField name={"dietaryPreferences"}>
          {(field) => (
            <>
              {dietaryOptions.map((option, index) => (
                <div key={option.id}>
                  <field.Item>
                    <input
                      id={option.id}
                      name={`dietaryPreferences[${index}]`}
                      type="checkbox"
                      value={option.id}
                      className="peer sr-only"
                      checked={field.state.value.includes(option.id)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const currentValue = option.id;
                        const currentPreferences = field.state.value ?? [];

                        if (isChecked) {
                          field.handleChange([
                            ...currentPreferences,
                            currentValue,
                          ]);
                        } else {
                          field.handleChange(
                            currentPreferences.filter(
                              (pref) => pref !== currentValue,
                            ),
                          );
                        }
                      }}
                    />
                    <DietaryPreferenceOption
                      id={option.id}
                      title={option.title}
                      description={option.description}
                      icon={option.icon}
                    />
                  </field.Item>
                </div>
              ))}
            </>
          )}
        </form.AppField>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" asChild>
          <Link href="/onboarding?step=1">Back</Link>
        </Button>
        <form.AppForm>
          <form.SubmitButton>Continue</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  );
}

export function StepTwoFormSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[...Array(8)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <Skeleton key={i} className="h-20 w-full rounded-md" />
      ))}
    </div>
  );
}
