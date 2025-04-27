"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import type { UserData } from "../page";

interface OnboardingCompleteProps {
  userData: UserData;
  onComplete: () => void;
}

export function OnboardingComplete({
  userData,
  onComplete,
}: OnboardingCompleteProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8 text-center">
      <div className="rounded-full bg-primary/10 p-3">
        <CheckCircle className="h-12 w-12 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="font-bold text-2xl">Setup Complete!</h2>
        <p className="text-muted-foreground">
          Thanks for sharing your preferences, {userData.firstName}. We're ready
          to help you with your meal prep journey.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4 rounded-lg border bg-muted/20 p-6">
        <Avatar className="h-20 w-20">
          <AvatarImage
            src={userData.avatar || ""}
            alt={`${userData.firstName} ${userData.lastName}`}
          />
          <AvatarFallback>
            {userData.firstName.charAt(0)}
            {userData.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div>
          <h3 className="font-semibold text-xl">
            {userData.firstName} {userData.lastName}
          </h3>

          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {userData.dietaryPreferences.map((pref) => (
              <span
                key={pref}
                className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-xs"
              >
                {pref.charAt(0).toUpperCase() + pref.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Button onClick={onComplete} className="mt-6">
        Go to Dashboard
      </Button>
    </div>
  );
}
