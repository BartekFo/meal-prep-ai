import { createLoader, parseAsInteger } from "nuqs/server";

export const onboardingSearchParamsKeys = {
  step: "step",
} as const;

export const onboardingSearchParams = {
  [onboardingSearchParamsKeys.step]: parseAsInteger.withDefault(1),
};

export const loadSearchParams = createLoader(onboardingSearchParams);
