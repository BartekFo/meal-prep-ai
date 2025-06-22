import type { PersonalInfo, DietaryPreferences, DislikedIngredients } from '../schema';

export interface DietaryOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  createdAt?: Date;
}

export interface UserOnboardingData extends PersonalInfo, DietaryPreferences, DislikedIngredients {
  userId: string;
}

export type SavePersonalInfoData = Omit<PersonalInfo, 'avatar'> & {
  userId: string;
  avatarUrl?: string;
};

export type SaveDietaryPreferencesData = DietaryPreferences & {
  userId: string;
};

export type SaveDislikedIngredientsData = DislikedIngredients & {
  userId: string;
}; 
