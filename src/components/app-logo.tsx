import { Heading3 } from "@/components/typography";
import { Sandwich } from "lucide-react";

export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <Sandwich className="h-6 w-6" />
      <span>
        <Heading3>Meal Preaping AI</Heading3>
      </span>
    </div>
  );
}
