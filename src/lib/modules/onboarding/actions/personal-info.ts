import { savePersonalInfo as dbSavePersonalInfo } from '../db/mutations';
import type { SavePersonalInfoData } from '../db/types';

export async function savePersonalInfo(data: any, userId: string) {
  try {
    // TODO: Add proper arktype validation
    // For now, assume data is properly typed from the form

    // Handle avatar file separately if needed
    let avatarUrl: string | undefined;
    if (data.avatar) {
      // TODO: Implement avatar upload
      // avatarUrl = await uploadAvatar(data.avatar, userId);
    }

    const saveData: SavePersonalInfoData = {
      userId,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      activityLevel: data.activityLevel,
      weightGoal: data.weightGoal,
      ...(avatarUrl && { avatarUrl })
    };

    const result = await dbSavePersonalInfo(saveData);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving personal info:', error);
    return { success: false, errors: 'Failed to save personal information' };
  }
} 
