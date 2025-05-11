import { createClient } from "@/lib/supabase/server";
import { StepTwoHeading } from "./heading";
import { StepTwoForm, StepTwoFormSkeleton } from "./step-two-form";

async function getDietaryOptions() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("dietary_options").select("*");

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function StepTwo() {
  const dietaryOptions = await getDietaryOptions();

  return (
    <div className="space-y-6">
      <StepTwoHeading />
      <StepTwoForm dietaryOptions={dietaryOptions} />
    </div>
  );
}

export async function StepTwoSkeleton() {
  return (
    <div className="space-y-6">
      <StepTwoHeading />
      <StepTwoFormSkeleton />
    </div>
  );
}
