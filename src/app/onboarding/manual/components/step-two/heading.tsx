import { Heading2 } from "@/components/typography";

export function StepTwoHeading() {
  return (
    <div>
      <Heading2 className="font-bold text-2xl">Dietary Preferences</Heading2>
      <p className="text-muted-foreground">
        Select the dietary preferences that apply to you. This helps us
        recommend recipes that match your needs.
      </p>
    </div>
  );
}
