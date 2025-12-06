import { auth } from '$lib/auth';
import type { EssentialInfo } from '../schema/essential-info';
import { fromPromise, type ResultAsync } from 'neverthrow';
import { AuthInternalError, type AuthError } from '$lib/errors/auth';

export function saveEssentialInfo(
	data: EssentialInfo,
	request: Request
): ResultAsync<{ data: unknown }, AuthError> {
	return fromPromise(
		(async () => {
			const result = await auth.api.updateUser({
				body: {
					firstName: data.firstName,
					lastName: data.lastName,
					weightGoal: data.weightGoal,
					allergies: data.allergies,
					dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
					gender: data.gender,
					activityLevel: data.activityLevel,
					currentWeight: data.currentWeight,
					height: data.height,
					onboardingStatus: 'step1_completed'
				},
				headers: request.headers
			});

			return { data: result };
		})(),
		(e) => new AuthInternalError({ cause: e })
	);
}
