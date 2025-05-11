import { StepTwo } from "./components/step-two";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { routes } from "@/lib/constants/routes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { StepOne } from "./components/step-one";
import { StepThree } from "./components/step-three";
import { StepTwoSkeleton } from "./components/step-two";
import { loadSearchParams } from "./search-params";

const TOTAL_STEPS = 3;

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ManualPage({ searchParams }: PageProps) {
  const { step } = await loadSearchParams(searchParams);

  const progress = step <= TOTAL_STEPS ? (step / TOTAL_STEPS) * 100 : 100;

  return (
    <>
      {step === 1 && (
        <Button variant="link" asChild className="!px-0 mb-4">
          <Link href={routes.onboarding.root}>
            <ArrowLeft />
            Back to onboarding options
          </Link>
        </Button>
      )}

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
      {step === 2 && (
        <Suspense fallback={<StepTwoSkeleton />}>
          <StepTwo />
        </Suspense>
      )}
      {step === 3 && <StepThree />}
    </>
  );
}
