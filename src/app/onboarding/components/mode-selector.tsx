"use client";

import { BotMessageSquare, NotebookPen } from "lucide-react";

import { TextMuted } from "@/components/typography";

import { Heading1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/constants/routes";
import { Handshake } from "lucide-react";
import Link from "next/link";

export function ModeSelector() {
  return (
    <div className="space-y-6 ">
      <div className="text-center">
        <NotebookPen className="mx-auto mb-4 h-12 w-12" />
        <Heading1>Welcome!</Heading1>
        <TextMuted>Let's start by choosing how you want to onboard.</TextMuted>
      </div>
      <div className=" grid grid-cols-2 gap-4">
        <Button
          asChild
          className="flex h-auto flex-col items-center justify-between whitespace-normal rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <Link href={routes.onboarding.ai}>
            <BotMessageSquare />
            AI
            <span className="text-center text-muted-foreground text-sm">
              Talk to our recipe assistant that will help you onboard.
            </span>
          </Link>
        </Button>

        <Button
          asChild
          className="flex h-auto flex-col items-center justify-between whitespace-normal rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <Link href={routes.onboarding.manual}>
            <Handshake />
            Manual
            <span className="text-center text-muted-foreground text-sm">
              Manually add your dietary preferences and ingredients.
            </span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
