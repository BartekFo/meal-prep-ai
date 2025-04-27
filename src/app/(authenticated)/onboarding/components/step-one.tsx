"use client";
import { useState } from "react";
import { z } from "zod";

import { Heading2 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserData } from "../page";
import { AvatarUpload } from "./avatar-upload";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  avatar: z.string().optional(),
});

interface StepOneProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
}

export function StepOne({ userData, updateUserData, onNext }: StepOneProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <Heading2 className="font-bold text-2xl">
          Welcome to Meal Prep AI
        </Heading2>
        <p className="text-muted-foreground">
          Let's start by getting to know you a little better.
        </p>
      </div>

      <form className="space-y-6">
        <div className="flex justify-center">
          <AvatarUpload value={""} onChange={() => {}} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="John" />

          <Input placeholder="Doe" />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
