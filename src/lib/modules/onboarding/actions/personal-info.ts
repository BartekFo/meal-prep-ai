import { auth } from '$lib/auth';

export async function savePersonalInfo(data: any) {
	try {
		// TODO: Add proper arktype validation
		// For now, assume data is properly typed from the form

		let avatarUrl: string | undefined;
		if (data.avatar) {
			// TODO: Implement avatar upload
			// avatarUrl = await uploadAvatar(data.avatar, userId);
		}

		const result = await auth.api.updateUser({
			body: {
				...data
			}
		});

		return { success: true, data: result };
	} catch (error) {
		console.error('Error saving personal info:', error);
		return { success: false, errors: 'Failed to save personal information' };
	}
}
