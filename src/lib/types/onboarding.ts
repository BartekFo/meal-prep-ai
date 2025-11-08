export type OnboardingStatus = 'not_started' | 'step1_completed' | 'completed';

export type OnboardingState = {
	status: OnboardingStatus;
	completedAt?: Date | null;
};
