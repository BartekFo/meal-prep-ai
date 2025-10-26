import { type } from "arktype";

export const essentialInfoSchema = type({
  firstName: "string>0",
  lastName: "string>0",
  allergies: "string",
  weightGoal: '"lose"|"maintain"|"gain"',
  dateOfBirth: "string>0",
  gender: "string>0",
  activityLevel: "string>0",
  currentWeight: "number>0",
  height: "number>0",
});

export type EssentialInfo = typeof essentialInfoSchema.infer;
