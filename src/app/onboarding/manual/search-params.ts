import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const onboardingSearchParamsKeys = {
  step: "step",
  mode: "mode",
} as const;

export const onboardingSearchParams = {
  [onboardingSearchParamsKeys.step]: parseAsInteger.withDefault(1),
  [onboardingSearchParamsKeys.mode]: parseAsString,
};

export const loadSearchParams = createLoader(onboardingSearchParams);
