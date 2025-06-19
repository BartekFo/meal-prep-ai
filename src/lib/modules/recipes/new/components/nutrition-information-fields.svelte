<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form/index';
	import RecipeFormCard from './recipe-form-card.svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { IRecipeFormValues } from '../schema';

	interface Props {
		form: SuperForm<IRecipeFormValues>;
	}

	const { form }: Props = $props();

	const { form: formData } = form;
</script>

<RecipeFormCard>
	{#snippet children()}
		<h2 class="prose mb-4 text-xl font-semibold">Nutrition Information</h2>
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			<Form.Field {form} name="calories">
				<Form.Control>
					{#snippet children({ props })}
						<div class="space-y-2">
							<Form.Label>Calories</Form.Label>
							<Input
								{...props}
								bind:value={$formData.calories}
								type="number"
								min="0"
								placeholder="0"
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="protein">
				<Form.Control>
					{#snippet children({ props })}
						<div class="space-y-2">
							<Form.Label>Protein (g)</Form.Label>
							<Input
								{...props}
								bind:value={$formData.protein}
								type="number"
								min="0"
								placeholder="0"
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="carbs">
				<Form.Control>
					{#snippet children({ props })}
						<div class="space-y-2">
							<Form.Label>Carbs (g)</Form.Label>
							<Input
								{...props}
								bind:value={$formData.carbs}
								type="number"
								min="0"
								placeholder="0"
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="fat">
				<Form.Control>
					{#snippet children({ props })}
						<div class="space-y-2">
							<Form.Label>Fat (g)</Form.Label>
							<Input {...props} bind:value={$formData.fat} type="number" min="0" placeholder="0" />
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
	{/snippet}
</RecipeFormCard>
