"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import type { UserData } from "../page";
import { DietaryPreferenceOption } from "./dietary-preference-option";

const formSchema = z.object({
  dietaryPreferences: z
    .array(z.string())
    .min(1, { message: "Please select at least one dietary preference" }),
});

interface StepTwoProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onBack: () => void;
}

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

export function StepTwo({
  userData,
  updateUserData,
  onNext,
  onBack,
}: StepTwoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dietaryPreferences: userData.dietaryPreferences,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-2xl">Dietary Preferences</h2>
        <p className="text-muted-foreground">
          Select the dietary preferences that apply to you. This helps us
          recommend recipes that match your needs.
        </p>
      </div>

      <form className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {dietaryOptions.map((option) => (
            <DietaryPreferenceOption
              key={option.id}
              id={option.id}
              title={option.title}
              description={option.description}
              icon={option.icon}
              selected={userData.dietaryPreferences.includes(option.id)}
              onToggle={(selected) => {
                const currentPreferences = [...userData.dietaryPreferences];

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

                updateUserData({ dietaryPreferences: currentPreferences });
              }}
            />
          ))}
        </div>

        {form.formState.errors.dietaryPreferences && (
          <p className="font-medium text-destructive text-sm">
            {form.formState.errors.dietaryPreferences.message}
          </p>
        )}

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || userData.dietaryPreferences.length === 0}
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
