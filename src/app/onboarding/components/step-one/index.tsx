"use client";
import { parseAsInteger, useQueryState } from "nuqs";
import { z } from "zod";

import { Heading2 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { onboardingSearchParamsKeys } from "../../search-params";
import { AvatarUpload } from "../avatar-upload";
const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  avatar: z.string().optional(),
});

export function StepOne() {
  const [_, setStep] = useQueryState(
    onboardingSearchParamsKeys.step,
    parseAsInteger.withDefault(1),
  );

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
