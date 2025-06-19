<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form/index';
	import * as Select from '$lib/components/ui/select/index';
	import { Textarea } from '$lib/components/ui/textarea';
	import { MEAL_TYPES } from '$lib/constants/meal-types';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import RecipeFormCard from './recipe-form-card.svelte';
	import RecipeImageUpload from './recipe-image-upload.svelte';
	import type { IRecipeFormValues } from '../schema';

	interface Props {
		form: SuperForm<IRecipeFormValues>;
	}

	const { form }: Props = $props();

	const { form: formData } = form;

	function handleImageChange(file?: File) {
		$formData.image = file;
	}
</script>

<RecipeFormCard>
	{#snippet children()}
		<h2 class="prose mb-4 text-xl font-semibold">Recipe Details</h2>
		<div class="grid gap-6 md:grid-cols-2">
			<div class="md:col-span-2">
				<Form.Field {form} name="title">
					<Form.Control>
						{#snippet children({ props })}
							<div class="space-y-2">
								<Form.Label>Recipe Title</Form.Label>
								<Input placeholder="Enter recipe title" {...props} bind:value={$formData.title} />
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="md:col-span-2">
				<Form.Field {form} name="description">
					<Form.Control>
						{#snippet children({ props })}
							<div class="space-y-2">
								<Form.Label>Description</Form.Label>
								<Textarea
									placeholder="Describe your recipe"
									class="min-h-[100px]"
									{...props}
									bind:value={$formData.description}
								/>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<div class="md:col-span-2">
				<Form.Field {form} name="image">
					<Form.Control>
						{#snippet children({ props })}
							<div class="space-y-2">
								<Form.Label>Recipe Image</Form.Label>
								<RecipeImageUpload
									{...props}
									value={$formData.image}
									onchange={handleImageChange}
								/>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<Form.Field {form} name="prepTime">
				<Form.Control>
					{#snippet children({ props })}
						<div class="space-y-2">
							<Form.Label>Prep Time (minutes)</Form.Label>
							<Input
								{...props}
								bind:value={$formData.prepTime}
								type="number"
								min="1"
								placeholder="15"
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="cookTime">
				<Form.Control>
					{#snippet children({ props })}
						<div class="space-y-2">
							<Form.Label>Cook Time (minutes)</Form.Label>
							<Input
								{...props}
								bind:value={$formData.cookTime}
								type="number"
								min="1"
								placeholder="15"
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="servings">
				<Form.Control>
					{#snippet children({ props })}
						<div class="space-y-2">
							<Form.Label>Servings</Form.Label>
							<Input
								{...props}
								bind:value={$formData.servings}
								type="number"
								min="1"
								placeholder="15"
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="mealType">
				<Form.Control>
					{#snippet children({ props })}
						<div class="space-y-2">
							<Form.Label>Meal Type</Form.Label>
							<Select.Root type="single" name={props.name} bind:value={$formData.mealType}>
								<Select.Trigger class="w-full" {...props}
									>{$formData.mealType ?? 'Select meal type'}</Select.Trigger
								>
								<Select.Content>
									{#each MEAL_TYPES as mealType}
										<Select.Item value={mealType}>{mealType}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
	{/snippet}
</RecipeFormCard>
