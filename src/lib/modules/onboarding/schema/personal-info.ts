import { type } from 'arktype';

export const personalInfoSchema = type({
  dateOfBirth: 'string>0',
  gender: "'male' | 'female' | 'non-binary' | 'prefer-not-to-say'"
});

export type PersonalInfoSchema = typeof personalInfoSchema.infer; 
