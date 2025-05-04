"use client";

import { useAppForm } from "@/components/form";
import { Heading2 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useTransform } from "@tanstack/react-form";
import { initialFormState, mergeForm } from "@tanstack/react-form/nextjs";
import Link from "next/link";
import { useActionState } from "react";
import { z } from "zod";
import saveDietaryPreferencesAction from "./action";
import { DietaryPreferenceOption } from "./dietary-preference-option";
import { onboardingStepTwoFormOpts } from "./shared-form-code";

const formSchema = z.object({
  dietaryPreferences: z
    .array(z.string())
    .min(1, { message: "Please select at least one dietary preference" }),
});

const dietaryOptions = [
  {
    id: "omnivore",
    title: "Omnivore",
    description:
      "I eat everything including meat, dairy, and plant-based foods.",
    icon: "🍖",
  },
  {
    id: "vegetarian",
    title: "Vegetarian",
    description: "I don't eat meat but I do eat dairy products and eggs.",
    icon: "🥗",
  },
  {
    id: "vegan",
    title: "Vegan",
    description:
      "I don't eat any animal products including meat, dairy, and eggs.",
    icon: "🌱",
  },
  {
    id: "pescatarian",
    title: "Pescatarian",
    description: "I eat fish but not other types of meat.",
    icon: "🐟",
  },
  {
    id: "keto",
    title: "Keto",
    description: "I follow a low-carb, high-fat diet.",
    icon: "🥑",
  },
  {
    id: "paleo",
    title: "Paleo",
    description:
      "I eat foods that would have been available to our Paleolithic ancestors.",
    icon: "🍗",
  },
  {
    id: "gluten-free",
    title: "Gluten-Free",
    description: "I avoid foods containing gluten.",
    icon: "🌾",
  },
  {
    id: "dairy-free",
    title: "Dairy-Free",
    description: "I avoid dairy products.",
    icon: "🥛",
  },
];

export function StepTwo() {
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

  return (
    <div className="space-y-6">
      <div>
        <Heading2 className="font-bold text-2xl">Dietary Preferences</Heading2>
        <p className="text-muted-foreground">
          Select the dietary preferences that apply to you. This helps us
          recommend recipes that match your needs.
        </p>
      </div>

      <form action={action} onSubmit={form.handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="dietaryPreferences" mode="array">
            {(field) => {
              return (
                <>
                  {dietaryOptions.map((option) => (
                    <DietaryPreferenceOption
                      key={option.id}
                      title={option.title}
                      description={option.description}
                      icon={option.icon}
                      selected={field.state.value.includes(option.id)}
                      onToggle={(selected) => {
                        const currentPreferences = [...field.state.value];

                        if (selected) {
                          if (!currentPreferences.includes(option.id)) {
                            currentPreferences.push(option.id);
                          }
                        } else {
                          const index = currentPreferences.indexOf(option.id);
                          if (index !== -1) {
                            currentPreferences.splice(index, 1);
                          }
                        }

                        field.handleChange(currentPreferences);
                      }}
                    />
                  ))}
                </>
              );
            }}
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
    </div>
  );
}
