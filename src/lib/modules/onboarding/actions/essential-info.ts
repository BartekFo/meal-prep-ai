import { auth } from '$lib/auth';

interface EssentialInfoData {
	firstName: string;
	lastName: string;
	allergies: string;
	weightGoal: 'lose' | 'maintain' | 'gain';
}

export async function saveEssentialInfo(data: EssentialInfoData, request: Request) {
	try {
		// Convert allergies string to array (splitting by comma and trimming)
		const allergiesArray = data.allergies
			? data.allergies
				.split(',')
				.map((allergy: string) => allergy.trim())
				.filter((allergy: string) => allergy.length > 0)
			: [];

		const result = await auth.api.updateUser({
			body: {
				firstName: data.firstName,
				lastName: data.lastName,
				weightGoal: data.weightGoal,
				allergies: allergiesArray
			},
			headers: request.headers
		});

		return { success: true, data: result };
	} catch (error) {
		console.error('Error saving essential info:', error);
		return { success: false, errors: 'Failed to save essential information' };
	}
}
