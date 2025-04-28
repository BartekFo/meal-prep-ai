import * as v from "valibot";

export const userDataSchema = v.object({
  firstName: v.string(),
  lastName: v.string(),
  avatar: v.string(),
});
