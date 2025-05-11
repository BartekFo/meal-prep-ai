"use client";
import { X } from "lucide-react";
import { useState } from "react";

import { Heading2, Text } from "@/components/typography";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { routes } from "@/lib/constants/routes";
import Link from "next/link";
import { safeParse } from "valibot";
import { onboardingSearchParamsKeys } from "../../search-params";
import { saveFoodPreferencesAction } from "./action";
import { ingredientSchema } from "./schema";

export function StepThree() {
  const [error, setError] = useState<string | null>(null);
  const [newDislikedIngredient, setNewDislikedIngredient] = useState("");
  const [dislikedIngredients, setDislikedIngredients] = useState<string[]>([]);

  const handleAddNewDislikedIngredient = () => {
    setError(null);
    const result = safeParse(ingredientSchema, newDislikedIngredient);
    if (result.issues) {
      setError(result.issues[0].message);
      return;
    }
    if (dislikedIngredients.includes(newDislikedIngredient)) {
      setError("Ingredient already added.");
      return;
    }
    setDislikedIngredients([...dislikedIngredients, newDislikedIngredient]);
    setNewDislikedIngredient("");
  };

  return (
    <div className="space-y-6">
      <div>
        <Heading2>Ingredients I Dislike:</Heading2>
        <Text>
          Tell us about ingredients you dislike. This helps us personalize your
          recipe recommendations.
        </Text>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddNewDislikedIngredient();
        }}
        className="flex gap-2"
      >
        <div className="flex flex-1 flex-col gap-2">
          <Input
            placeholder="Add ingredient you dislike (e.g., Cilantro)"
            value={newDislikedIngredient}
            onChange={(e) => setNewDislikedIngredient(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <Button type="submit">Add</Button>
      </form>
      <div className="flex min-h-[40px] flex-wrap gap-2">
        {dislikedIngredients.map((ingredient) => (
          <Button
            key={ingredient}
            variant="secondary"
            className={badgeVariants({ variant: "secondary" })}
            onClick={() =>
              setDislikedIngredients(
                dislikedIngredients.filter((i) => i !== ingredient),
              )
            }
          >
            {ingredient}
            <X className="ml-1 h-3 w-3 cursor-pointer" />
          </Button>
        ))}
        {dislikedIngredients.length === 0 && (
          <p className="pt-2 text-muted-foreground text-sm">
            No disliked ingredients added yet.
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" asChild>
          <Link
            href={`${routes.onboarding.manual}?${onboardingSearchParamsKeys.step}=2`}
          >
            Back
          </Link>
        </Button>

        <Button onClick={() => saveFoodPreferencesAction(dislikedIngredients)}>
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
