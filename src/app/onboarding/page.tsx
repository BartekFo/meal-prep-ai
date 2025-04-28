import { Progress } from "@/components/ui/progress";
import type { SearchParams } from "nuqs/server";
import { StepOne } from "./components/step-one";
import { loadSearchParams } from "./search-params";

export type UserData = {
  firstName: string;
  lastName: string;
  avatar: string;
  dietaryPreferences: string[];
  likedIngredients: string[];
  dislikedIngredients: string[];
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const TOTAL_STEPS = 3;

export default async function OnboardingPage({ searchParams }: PageProps) {
  const { step } = await loadSearchParams(searchParams);

  const progress = step <= TOTAL_STEPS ? (step / TOTAL_STEPS) * 100 : 100;

  // const handleNext = () => {
  //   if (currentStep < totalSteps) {
  //     setCurrentStep((prev) => prev + 1);
  //     window.scrollTo(0, 0);
  //   } else {
  //     // In a real app, you would save the data to your backend here
  //     console.log("Onboarding complete with data:", userData);
  //     setCurrentStep(4); // Show completion screen
  //   }
  // };

  // const handleBack = () => {
  //   if (currentStep > 1) {
  //     setCurrentStep((prev) => prev - 1);
  //     window.scrollTo(0, 0);
  //   }
  // };

  // const handleComplete = () => {
  //   router.push("/recipes");
  // };

  return (
    <>
      {step <= TOTAL_STEPS && (
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm">
            <span>
              Step {step} of {TOTAL_STEPS}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      {step === 1 && <StepOne />}
      {/* {step === 2 && <StepTwo />}
      {step === 3 && <StepThree />}
      {step === 4 && <OnboardingComplete />} */}
    </>
  );
}
