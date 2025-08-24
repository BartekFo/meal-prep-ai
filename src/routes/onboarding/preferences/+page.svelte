<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import { ArrowLeft } from '@lucide/svelte';
	import { DIETARY_TYPES } from '$lib/modules/onboarding/constants';

	let { data } = $props();

	let formData = $state({
		dietaryType: data.user.dietaryType,
		dislikedFoods: data.user.dislikedFoods,
		preferredMealTypes: data.user.preferredMealTypes
	});

	function toggleMealType(mealType: string) {
		if (formData.preferredMealTypes.includes(mealType)) {
			formData.preferredMealTypes = formData.preferredMealTypes.filter((type: string) => type !== mealType);
		} else {
			formData.preferredMealTypes = [...formData.preferredMealTypes, mealType];
		}
	}
</script>

<main class="flex-1 px-4 py-8">
	<div class="mx-auto max-w-2xl">
		<div class="bg-background rounded-lg border p-6 shadow-sm">
			<!-- Back button -->
			<Button variant="link" href="/onboarding" class="mb-4 !px-0">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back
			</Button>

			<!-- Progress indicator -->
			<div class="mb-8">
				<div class="mb-2 flex justify-between text-sm">
					<span>Step 2 of 2</span>
					<span>100%</span>
				</div>
				<Progress value={100} class="h-2" />
			</div>

			<!-- Content -->
			<div class="space-y-6">
				<div class="text-center">
					<h2 class="text-xl font-bold">Food Preferences</h2>
					<p class="text-muted-foreground">Help us personalize your meal recommendations</p>
				</div>

				<form method="POST" use:enhance class="space-y-6">
					<Card>
						<CardContent class="pt-6">
							<h3 class="mb-4 text-lg font-medium">Dietary Type</h3>
							<div class="space-y-3">
								<div class="flex flex-col space-y-2">
									{#each DIETARY_TYPES as dietType}
										<label class="flex items-center space-x-3">
											<input
												type="radio"
												name="dietaryType"
												value={dietType.value}
												required
												bind:group={formData.dietaryType}
											/>
											<span>{dietType.label}</span>
										</label>
									{/each}
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent class="pt-6">
							<h3 class="mb-4 text-lg font-medium">Food Preferences</h3>
							<div class="space-y-4">
								<!-- Disliked Foods -->
								<div class="space-y-2">
									<Label for="dislikedFoods">Disliked Foods (optional)</Label>
									<Input
										id="dislikedFoods"
										name="dislikedFoods"
										type="text"
										placeholder="e.g., mushrooms, broccoli, seafood"
										bind:value={formData.dislikedFoods}
									/>
									<p class="text-muted-foreground text-xs">
										List foods you prefer to avoid in your meal plans
									</p>
								</div>

								<!-- Preferred Meal Types -->
								<div class="space-y-3">
									<Label>Preferred Meal Types *</Label>
									<p class="text-muted-foreground text-xs">
										Select which meals you'd like help planning (choose at least one)
									</p>
									<div class="flex flex-col space-y-2">
										<label class="flex items-center space-x-3">
											<input
												type="checkbox"
												name="preferredMealTypes"
												value="breakfast"
												checked={formData.preferredMealTypes.includes('breakfast')}
												onchange={() => toggleMealType('breakfast')}
											/>
											<span>Breakfast</span>
										</label>
										<label class="flex items-center space-x-3">
											<input
												type="checkbox"
												name="preferredMealTypes"
												value="lunch"
												checked={formData.preferredMealTypes.includes('lunch')}
												onchange={() => toggleMealType('lunch')}
											/>
											<span>Lunch</span>
										</label>
										<label class="flex items-center space-x-3">
											<input
												type="checkbox"
												name="preferredMealTypes"
												value="dinner"
												checked={formData.preferredMealTypes.includes('dinner')}
												onchange={() => toggleMealType('dinner')}
											/>
											<span>Dinner</span>
										</label>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<div class="flex justify-between">
						<Button variant="outline" href="/onboarding">Previous</Button>
						<Button type="submit">Complete Setup</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
</main>
