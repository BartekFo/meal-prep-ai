import { MEAL_TYPES } from "@/lib/constants/meal-types";
import type { TMealType } from "@/lib/types";

export function isMealType(value: string): value is TMealType {
  return MEAL_TYPES.includes(value as TMealType);
}
