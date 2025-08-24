export type OnboardingStatus = 'not_started' | 'step1_completed' | 'completed';

export interface OnboardingState {
	status: OnboardingStatus;
	completedAt?: Date | null;
}