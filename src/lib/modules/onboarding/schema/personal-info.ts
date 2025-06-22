import { type } from 'arktype';

export const personalInfoSchema = type({
  firstName: 'string>0',
  lastName: 'string>0',
  avatar: 'File|undefined',
  dateOfBirth: 'string|undefined',
  gender: 'string|undefined',
  activityLevel: 'string>0',
  weightGoal: 'string>0'
});

export type PersonalInfo = typeof personalInfoSchema.infer; 
