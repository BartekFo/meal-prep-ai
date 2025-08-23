<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';
	import { NotebookPen } from '@lucide/svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group';

	let { data } = $props();

	const form = superForm(data.form);
	const { form: formData, enhance } = form;

	const weightGoalOptions = [
		{ value: 'lose', label: 'Lose weight' },
		{ value: 'maintain', label: 'Maintain weight' },
		{ value: 'gain', label: 'Gain weight' }
	] as const;
</script>

<main class="flex-1 px-4 py-8">
	<div class="mx-auto max-w-2xl">
		<div class="bg-background rounded-lg border p-6 shadow-sm">
			<div class="mb-8">
				<div class="mb-2 flex justify-between text-sm">
					<span>Step 1 of 2</span>
					<span>50%</span>
				</div>
				<Progress value={50} class="h-2" />
			</div>

			<div class="space-y-6">
				<div class="grid place-items-center">
					<NotebookPen class="mx-auto mb-4 h-12 w-12" />
					<div class="prose text-center">
						<h1>Welcome to Meal Prep AI</h1>
						<p class="text-muted-foreground">
							Let's start with some essential information to get you started.
						</p>
					</div>
				</div>

				<form method="POST" use:enhance class="space-y-6">
					<Card>
						<CardContent class="prose">
							<h3 class="mb-4 text-lg font-medium">Personal Information</h3>
							<div class="grid gap-x-4 gap-y-6 md:grid-cols-2">
								<Form.Field {form} name="firstName">
									<Form.Control>
										{#snippet children({ props })}
											<div class="space-y-2">
												<Form.Label class="gap-0"
													>First Name <span class="text-destructive">*</span></Form.Label
												>
												<Input {...props} bind:value={$formData.firstName} />
											</div>
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>

								<Form.Field {form} name="lastName">
									<Form.Control>
										{#snippet children({ props })}
											<div class="space-y-2">
												<Form.Label class="gap-0"
													>Last Name <span class="text-destructive">*</span></Form.Label
												>
												<Input {...props} bind:value={$formData.lastName} />
											</div>
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent class="prose">
							<h3 class="mb-4 text-lg font-medium">Essential Information</h3>
							<div class="space-y-4">
								<Form.Field {form} name="allergies">
									<Form.Control>
										{#snippet children({ props })}
											<div class="space-y-2">
												<Form.Label>Food Allergies</Form.Label>
												<Input
													{...props}
													placeholder="e.g., nuts, shellfish, dairy (leave blank if none)"
													bind:value={$formData.allergies}
												/>
											</div>
										{/snippet}
									</Form.Control>
									<Form.Description>Please list any food allergies for your safety</Form.Description
									>
									<Form.FieldErrors />
								</Form.Field>

								<Form.Field {form} name="weightGoal">
									<Form.Control>
										{#snippet children({ props })}
											<div class="space-y-3">
												<Form.Label>Weight Goal <span class="text-destructive">*</span></Form.Label>
												<RadioGroup.Root
													{...props}
													bind:value={$formData.weightGoal}
													class="flex flex-col space-y-2"
												>
													{#each weightGoalOptions as option}
														<div class="flex items-center space-x-3">
															<RadioGroup.Item value={option.value} id="weight-{option.value}" />
															<label
																for="weight-{option.value}"
																class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
															>
																{option.label}
															</label>
														</div>
													{/each}
												</RadioGroup.Root>
											</div>
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
						</CardContent>
					</Card>

					<div class="flex justify-end">
						<Button type="submit">Continue to Preferences</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
</main>
