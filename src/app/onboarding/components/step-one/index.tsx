"use client";
import { parseAsInteger, useQueryState } from "nuqs";

import { Heading2 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTransform } from "@tanstack/react-form";
import { initialFormState, mergeForm } from "@tanstack/react-form/nextjs";
import { useActionState } from "react";
import { onboardingSearchParamsKeys } from "../../search-params";
import { AvatarUpload } from "../avatar-upload";
import saveUserDataAction from "./actions";
import { formOpts } from "./shared-form-code";

export function StepOne() {
  const [_, setStep] = useQueryState(
    onboardingSearchParamsKeys.step,
    parseAsInteger.withDefault(1),
  );

  const [state, action] = useActionState(saveUserDataAction, initialFormState);

  const form = useAppForm({
    ...formOpts,
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, state ?? {}),
      [state],
    ),
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Heading2>Welcome to Meal Prep AI</Heading2>
        <p className="text-muted-foreground">
          Let's start by getting to know you a little better.
        </p>
      </div>

      <form className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex flex-col items-center justify-center">
              <AvatarUpload value={""} onChange={() => {}} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="John" />

              <Input placeholder="Doe" />
              <Button type="submit">Continue</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
