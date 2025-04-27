"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingComplete } from "./components/onboarding-complete";
import { StepOne } from "./components/step-one";
import { StepThree } from "./components/step-three";
import { StepTwo } from "./components/step-two";

export type UserData = {
  firstName: string;
  lastName: string;
  avatar: string;
  dietaryPreferences: string[];
  likedIngredients: string[];
  dislikedIngredients: string[];
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    avatar: "",
    dietaryPreferences: [],
    likedIngredients: [],
    dislikedIngredients: [],
  });

  const totalSteps = 3;

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      // In a real app, you would save the data to your backend here
      console.log("Onboarding complete with data:", userData);
      setCurrentStep(4); // Show completion screen
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleComplete = () => {
    router.push("/recipes");
  };

  return (
    <>
      {currentStep === 1 && (
        <StepOne
          userData={userData}
          updateUserData={updateUserData}
          onNext={handleNext}
        />
      )}
      {currentStep === 2 && (
        <StepTwo
          userData={userData}
          updateUserData={updateUserData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 3 && (
        <StepThree
          userData={userData}
          updateUserData={updateUserData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {currentStep === 4 && (
        <OnboardingComplete userData={userData} onComplete={handleComplete} />
      )}
    </>
  );
}
