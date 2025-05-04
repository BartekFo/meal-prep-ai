"use client";

import { Heading3, Text } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DietaryPreferenceOptionProps {
  title: string;
  description: string;
  icon: string;
  selected: boolean;
  onToggle: (selected: boolean) => void;
}

export function DietaryPreferenceOption({
  title,
  description,
  icon,
  selected,
  onToggle,
}: DietaryPreferenceOptionProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "flex h-auto cursor-pointer justify-start gap-4 whitespace-normal rounded-lg border p-4 text-left transition-all hover:bg-accent",
        selected && "!border-primary !bg-primary/5",
      )}
      onClick={() => onToggle(!selected)}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl">
        {icon}
      </div>
      <div className="space-y-1">
        <Heading3 className="font-medium">{title}</Heading3>
        <Text className="text-muted-foreground text-sm">{description}</Text>
      </div>
    </Button>
  );
}
