<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent } from '$lib/components/ui/card';

	import * as Select from '$lib/components/ui/select';
	import { Separator } from '$lib/components/ui/separator';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { User, X } from '@lucide/svelte';

	// Constants
	const ACTIVITY_LEVELS = [
		{ value: 'sedentary', label: 'Sedentary (little or no exercise)' },
		{ value: 'light', label: 'Light (exercise 1-3 days/week)' },
		{ value: 'moderate', label: 'Moderate (exercise 3-5 days/week)' },
		{ value: 'active', label: 'Active (exercise 6-7 days/week)' },
		{ value: 'very-active', label: 'Very Active (hard exercise daily or 2x/day)' }
	];

	const WEIGHT_GOALS = [
		{ value: 'lose', label: 'Lose weight' },
		{ value: 'maintain', label: 'Maintain weight' },
		{ value: 'gain', label: 'Gain weight' }
	];

	const GENDER_OPTIONS = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'non-binary', label: 'Non-binary' },
		{ value: 'prefer-not-to-say', label: 'Prefer not to say' }
	];

	let formData = $state({
		firstName: '',
		lastName: '',
		dateOfBirth: '',
		gender: '',
		activityLevel: '',
		weightGoal: '',
		avatar: null as File | null
	});

	let avatarPreview = $state<string | null>(null);

	function handleAvatarUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file && file.type.startsWith('image/')) {
			formData.avatar = file;
			avatarPreview = URL.createObjectURL(file);
		}
	}

	function removeAvatar() {
		formData.avatar = null;
		avatarPreview = null;
	}
</script>

<form method="POST" use:enhance class="space-y-6" enctype="multipart/form-data">
	<Card>
		<CardContent class="pt-6">
			<!-- Avatar Upload -->
			<div class="mb-6 flex flex-col items-center justify-center">
				<div class="relative w-fit">
					<label
						for="avatar"
						class="group text-primary block cursor-pointer text-sm font-medium hover:underline"
					>
						<Avatar
							class="group-hover:border-primary/50 h-24 w-24 border-2 border-transparent transition-colors"
						>
							{#if avatarPreview}
								<img
									src={avatarPreview}
									alt="Avatar Preview"
									class="h-full w-full rounded-full object-cover"
								/>
							{:else}
								<AvatarFallback class="bg-muted">
									<User class="text-muted-foreground/50 h-12 w-12" />
								</AvatarFallback>
							{/if}
						</Avatar>
						<span class="mt-2 block">
							{formData.avatar ? 'Change avatar' : 'Upload avatar'}
						</span>
					</label>

					{#if formData.avatar}
						<Button
							type="button"
							variant="destructive"
							size="icon"
							class="absolute -top-2 -right-2 h-6 w-6 rounded-full"
							onclick={removeAvatar}
						>
							<X class="h-3 w-3" />
						</Button>
					{/if}

					<input
						id="avatar"
						name="avatar"
						type="file"
						accept="image/*"
						class="hidden"
						onchange={handleAvatarUpload}
					/>
				</div>
			</div>

			<!-- Personal Info Grid -->
			<div class="grid gap-x-4 gap-y-6 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="firstName">First Name</Label>
					<Input
						id="firstName"
						name="firstName"
						placeholder="First Name"
						bind:value={formData.firstName}
						required
					/>
				</div>

				<div class="space-y-2">
					<Label for="lastName">Last Name</Label>
					<Input
						id="lastName"
						name="lastName"
						placeholder="Last Name"
						bind:value={formData.lastName}
						required
					/>
				</div>

				<div class="space-y-2">
					<Label for="dateOfBirth">Date of Birth</Label>
					<Input
						id="dateOfBirth"
						name="dateOfBirth"
						type="date"
						bind:value={formData.dateOfBirth}
					/>
				</div>

				<div class="space-y-2">
					<Label for="gender">Gender</Label>
					<Select.Root name="gender" bind:value={formData.gender}>
						<Select.Trigger class="w-full">
							{formData.gender
								? GENDER_OPTIONS.find((g) => g.value === formData.gender)?.label
								: 'Select gender'}
						</Select.Trigger>
						<Select.Content>
							{#each GENDER_OPTIONS as option}
								<Select.Item value={option.value}>{option.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</CardContent>
	</Card>

	<Card>
		<CardContent class="pt-6">
			<h3 class="mb-4 text-lg font-medium">Fitness Goals</h3>
			<div class="space-y-4">
				<!-- Activity Level -->
				<div class="space-y-3">
					<Label>Activity Level</Label>
					<div class="flex flex-col space-y-1">
						{#each ACTIVITY_LEVELS as level}
							<div class="flex items-center space-x-3">
								<input
									type="radio"
									value={level.value}
									id={level.value}
									name="activityLevel"
									bind:group={formData.activityLevel}
									class="h-4 w-4"
								/>
								<Label for={level.value} class="font-normal">
									{level.label}
								</Label>
							</div>
						{/each}
					</div>
				</div>

				<Separator />

				<!-- Weight Goal -->
				<div class="space-y-3">
					<Label>Weight Goal</Label>
					<div class="flex flex-col space-y-1">
						{#each WEIGHT_GOALS as goal}
							<div class="flex items-center space-x-2">
								<input
									type="radio"
									value={goal.value}
									id={goal.value}
									name="weightGoal"
									bind:group={formData.weightGoal}
									class="h-4 w-4"
								/>
								<Label for={goal.value}>{goal.label}</Label>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</CardContent>
	</Card>

	<div class="flex justify-end">
		<Button type="submit" class="md:col-span-2">Continue</Button>
	</div>
</form>
