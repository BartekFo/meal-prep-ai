"use client";

import { cn } from "@/lib/utils";

interface DietaryPreferenceOptionProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  selected: boolean;
  onToggle: (selected: boolean) => void;
}

export function DietaryPreferenceOption({
  id,
  title,
  description,
  icon,
  selected,
  onToggle,
}: DietaryPreferenceOptionProps) {
  return (
    <div
      className={cn(
        "flex cursor-pointer gap-4 rounded-lg border p-4 transition-all hover:bg-accent",
        selected && "border-primary bg-primary/5",
      )}
      onClick={() => onToggle(!selected)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle(!selected);
        }
      }}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
