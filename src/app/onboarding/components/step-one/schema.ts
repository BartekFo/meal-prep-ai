import * as v from "valibot";

export const userDataSchema = v.object({
  firstName: v.string(),
  lastName: v.string(),
  avatar: v.string(),
  dateOfBirth: v.optional(v.date()),
  gender: v.optional(v.string()),
  activityLevel: v.string(),
  weightGoal: v.string(),
});
