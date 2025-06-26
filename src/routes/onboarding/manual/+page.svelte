<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import { ArrowLeft } from '@lucide/svelte';

	let formData = $state({
		firstName: '',
		lastName: '',
		dateOfBirth: '',
		gender: '',
		activityLevel: '',
		weightGoal: ''
	});
</script>

<main class="flex-1 px-4 py-8">
	<div class="mx-auto max-w-2xl">
		<div class="bg-background rounded-lg border p-6 shadow-sm">
			<!-- Back button -->
			<Button variant="link" href="/onboarding" class="mb-4 !px-0">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back to onboarding options
			</Button>

			<!-- Progress indicator -->
			<div class="mb-8">
				<div class="mb-2 flex justify-between text-sm">
					<span>Step 1 of 3</span>
					<span>33%</span>
				</div>
				<Progress value={33} class="h-2" />
			</div>

			<!-- Content -->
			<div class="space-y-6">
				<div class="text-center">
					<h2 class="text-xl font-bold">Welcome to Meal Prep AI</h2>
					<p class="text-muted-foreground">Let's start by getting to know you a little better.</p>
				</div>

				<form method="POST" use:enhance class="space-y-6">
					<Card>
						<CardContent class="pt-6">
							<div class="grid gap-x-4 gap-y-6 md:grid-cols-2">
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
									<select
										name="gender"
										bind:value={formData.gender}
										class="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
									>
										<option value="">Select gender</option>
										<option value="male">Male</option>
										<option value="female">Female</option>
										<option value="non-binary">Non-binary</option>
										<option value="prefer-not-to-say">Prefer not to say</option>
									</select>
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
										<label class="flex items-center space-x-3">
											<input
												type="radio"
												name="activityLevel"
												value="sedentary"
												bind:group={formData.activityLevel}
											/>
											<span>Sedentary (little or no exercise)</span>
										</label>
										<label class="flex items-center space-x-3">
											<input
												type="radio"
												name="activityLevel"
												value="light"
												bind:group={formData.activityLevel}
											/>
											<span>Light (exercise 1-3 days/week)</span>
										</label>
										<label class="flex items-center space-x-3">
											<input
												type="radio"
												name="activityLevel"
												value="moderate"
												bind:group={formData.activityLevel}
											/>
											<span>Moderate (exercise 3-5 days/week)</span>
										</label>
										<label class="flex items-center space-x-3">
											<input
												type="radio"
												name="activityLevel"
												value="active"
												bind:group={formData.activityLevel}
											/>
											<span>Active (exercise 6-7 days/week)</span>
										</label>
										<label class="flex items-center space-x-3">
											<input
												type="radio"
												name="activityLevel"
												value="very-active"
												bind:group={formData.activityLevel}
											/>
											<span>Very Active (hard exercise daily or 2x/day)</span>
										</label>
									</div>
								</div>

								<!-- Weight Goal -->
								<div class="space-y-3">
									<Label>Weight Goal</Label>
									<div class="flex flex-col space-y-1">
										<label class="flex items-center space-x-3">
											<input
												type="radio"
												name="weightGoal"
												value="lose"
												bind:group={formData.weightGoal}
											/>
											<span>Lose weight</span>
										</label>
										<label class="flex items-center space-x-3">
											<input
												type="radio"
												name="weightGoal"
												value="maintain"
												bind:group={formData.weightGoal}
											/>
											<span>Maintain weight</span>
										</label>
										<label class="flex items-center space-x-3">
											<input
												type="radio"
												name="weightGoal"
												value="gain"
												bind:group={formData.weightGoal}
											/>
											<span>Gain weight</span>
										</label>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<div class="flex justify-end">
						<Button type="submit">Continue</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
</main>
