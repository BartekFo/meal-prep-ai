<script lang="ts">
import { ArrowLeft } from '@lucide/svelte';
import { superForm } from 'sveltekit-superforms';
import { Button } from '$lib/components/ui/button';
import { Card, CardContent } from '$lib/components/ui/card';
import * as Form from '$lib/components/ui/form';
import { Input } from '$lib/components/ui/input';
import { Progress } from '$lib/components/ui/progress';
import * as RadioGroup from '$lib/components/ui/radio-group';
import { DIETARY_TYPES } from '$lib/modules/onboarding/constants';

const { data } = $props();

const form = superForm(data.form);
const { form: formData, enhance } = form;

function toggleMealType(mealType: string) {
  if ($formData.preferredMealTypes.includes(mealType)) {
    $formData.preferredMealTypes = $formData.preferredMealTypes.filter(
      (type: string) => type !== mealType
    );
  } else {
    $formData.preferredMealTypes = [...$formData.preferredMealTypes, mealType];
  }
}
</script>

<main class="flex-1 px-4 py-8">
	<div class="mx-auto max-w-2xl">
		<div class="bg-background rounded-lg border p-6 shadow-sm">
			<Button variant="link" href="/onboarding" class="mb-4 !px-0">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back
			</Button>

			<div class="mb-8">
				<div class="mb-2 flex justify-between text-sm">
					<span>Step 2 of 2</span>
					<span>100%</span>
				</div>
				<Progress value={100} class="h-2" />
			</div>

			<div class="space-y-6">
				<div class="text-center">
					<h2 class="text-xl font-bold">Food Preferences</h2>
					<p class="text-muted-foreground">Help us personalize your meal recommendations</p>
				</div>

				<form method="POST" use:enhance class="space-y-6">
					<Card>
						<CardContent class="pt-6">
							<Form.Field {form} name="dietaryType">
								<Form.Control>
									{#snippet children({ props })}
										<div class="space-y-3">
											<Form.Label class="mb-4 text-lg font-medium">Dietary Type</Form.Label>
											<RadioGroup.Root
												{...props}
												bind:value={$formData.dietaryType}
												class="flex flex-col space-y-2"
											>
												{#each DIETARY_TYPES as dietType}
													<div class="flex items-center space-x-3">
														<RadioGroup.Item value={dietType.value} id="diet-{dietType.value}" />
														<label
															for="diet-{dietType.value}"
															class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
														>
															{dietType.label}
														</label>
													</div>
												{/each}
											</RadioGroup.Root>
										</div>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</CardContent>
					</Card>

					<Card>
						<CardContent class="pt-6">
							<h3 class="mb-4 text-lg font-medium">Food Preferences</h3>
							<div class="space-y-4">
								<Form.Field {form} name="dislikedFoods">
									<Form.Control>
										{#snippet children({ props })}
											<div class="space-y-2">
												<Form.Label>Disliked Foods (optional)</Form.Label>
												<Input
													{...props}
													type="text"
													placeholder="e.g., mushrooms, broccoli, seafood"
													bind:value={$formData.dislikedFoods}
												/>
												<Form.Description>
													List foods you prefer to avoid in your meal plans
												</Form.Description>
											</div>
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>

								<Form.Field {form} name="preferredMealTypes">
									<Form.Control>
										{#snippet children({ props })}
											<div class="space-y-3">
												<Form.Label>Preferred Meal Types <span class="text-destructive">*</span></Form.Label>
												<Form.Description>
													Select which meals you'd like help planning (choose at least one)
												</Form.Description>
												<div class="flex flex-col space-y-2">
													<label class="flex items-center space-x-3">
														<input
															type="checkbox"
															name="preferredMealTypes"
															value="breakfast"
															checked={$formData.preferredMealTypes.includes('breakfast')}
															onchange={() => toggleMealType('breakfast')}
														/>
														<span>Breakfast</span>
													</label>
													<label class="flex items-center space-x-3">
														<input
															type="checkbox"
															name="preferredMealTypes"
															value="lunch"
															checked={$formData.preferredMealTypes.includes('lunch')}
															onchange={() => toggleMealType('lunch')}
														/>
														<span>Lunch</span>
													</label>
													<label class="flex items-center space-x-3">
														<input
															type="checkbox"
															name="preferredMealTypes"
															value="dinner"
															checked={$formData.preferredMealTypes.includes('dinner')}
															onchange={() => toggleMealType('dinner')}
														/>
														<span>Dinner</span>
													</label>
												</div>
											</div>
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
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
