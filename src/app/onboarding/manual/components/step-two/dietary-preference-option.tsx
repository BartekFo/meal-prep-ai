"use client";

import { Heading3, Text } from "@/components/typography";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DietaryPreferenceOptionProps {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export function DietaryPreferenceOption({
  id,
  title,
  description,
  icon,
}: DietaryPreferenceOptionProps) {
  return (
    <Label
      htmlFor={id}
      className={cn(
        "flex h-auto cursor-pointer items-center justify-start gap-4 whitespace-normal rounded-lg border p-4 text-left transition-all hover:bg-accent",
        "peer-checked:!border-primary peer-checked:!bg-primary/5",
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl">
        {icon}
      </div>
      <div className="space-y-1">
        <Heading3 className="font-medium">{title}</Heading3>
        <Text className="text-muted-foreground text-sm">{description}</Text>
      </div>
    </Label>
  );
}
