<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form/index';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { cn } from '$lib/utils';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { ArrowLeft, CalendarIcon } from '@lucide/svelte';
	import { Progress } from '$lib/components/ui/progress';
	import type { PageData } from './$types';
	import type { ComponentProps } from 'svelte';

	const { data }: { data: PageData } = $props();

	const form = superForm(data.form);
	const { form: formData, enhance } = form;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	const genderLabels = {
		male: 'Male',
		female: 'Female',
		'non-binary': 'Non-binary',
		'prefer-not-to-say': 'Prefer not to say'
	} as const;

	let value = $derived($formData.dateOfBirth ? parseDate($formData.dateOfBirth) : undefined);
	let placeholder = $state<DateValue>(today(getLocalTimeZone()));
</script>

<main class="flex-1 px-4 py-8">
	<div class="mx-auto max-w-2xl">
		<div class="bg-background rounded-lg border p-6 shadow-sm">
			<Button variant="link" href="/onboarding" class="mb-4 !px-0">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Back to onboarding options
			</Button>

			<div class="mb-8">
				<div class="mb-2 flex justify-between text-sm">
					<span>Step 1 of 3</span>
					<span>33%</span>
				</div>
				<Progress value={33} class="h-2" />
			</div>

			<div class="space-y-6">
				<div class="prose text-center">
					<h2>Welcome to Meal Prep AI</h2>
					<p class="text-muted-foreground">Let's start by getting to know you a little better.</p>
				</div>

				<form method="POST" use:enhance class="space-y-6">
					<Card>
						<CardContent class="prose space-y-4 pt-6">
							<h3>Basic Information</h3>
							<div class="grid gap-x-4 gap-y-6 md:grid-cols-2">
								<Form.Field {form} name="dateOfBirth">
									<Form.Control>
										{#snippet children({ props })}
											<div class="space-y-2">
												<Form.Label>Date of Birth</Form.Label>
												<Popover.Root>
													<Popover.Trigger
														class={cn(
															buttonVariants({ variant: 'outline' }),
															'w-full justify-start pl-4 text-left font-normal',
															!value && 'text-muted-foreground'
														)}
														{...props}
													>
														{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
														<CalendarIcon class="ml-auto size-4 opacity-50" />
													</Popover.Trigger>
													<Popover.Content class="w-auto p-0" side="top">
														<Calendar
															captionLayout="dropdown"
															type="single"
															value={value as DateValue}
															bind:placeholder
															minValue={new CalendarDate(1900, 1, 1)}
															maxValue={today(getLocalTimeZone())}
															calendarLabel="Date of birth"
															onValueChange={(v) => {
																if (v) {
																	$formData.dateOfBirth = v.toString();
																} else {
																	$formData.dateOfBirth = '';
																}
															}}
														/>
													</Popover.Content>
												</Popover.Root>
											</div>
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>

								<Form.Field {form} name="gender">
									<Form.Control>
										{#snippet children({ props })}
											<div class="space-y-2">
												<Form.Label>Gender</Form.Label>
												<Select.Root type="single" name={props.name} bind:value={$formData.gender}>
													<Select.Trigger class="w-full" {...props}>
														{$formData.gender ? genderLabels[$formData.gender] : 'Select gender'}
													</Select.Trigger>
													<Select.Content>
														<Select.Item value="male">Male</Select.Item>
														<Select.Item value="female">Female</Select.Item>
														<Select.Item value="non-binary">Non-binary</Select.Item>
														<Select.Item value="prefer-not-to-say">Prefer not to say</Select.Item>
													</Select.Content>
												</Select.Root>
											</div>
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
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
