<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form/index';
	import { Plus, Trash2 } from '@lucide/svelte';
	import RecipeFormCard from './recipe-form-card.svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { IRecipeFormValues } from '../schema';

	interface Props {
		form: SuperForm<IRecipeFormValues>;
	}

	const { form }: Props = $props();

	const { form: formData } = form;

	function addIngredient() {
		if (!$formData.ingredients) {
			$formData.ingredients = [];
		}
		$formData.ingredients = [...$formData.ingredients, ''];
		console.log($formData.ingredients);
	}

	function removeIngredient(index: number) {
		if ($formData.ingredients.length > 1) {
			$formData.ingredients = $formData.ingredients.filter((_, i) => i !== index);
		}
	}

	function updateIngredient(index: number, value: string) {
		$formData.ingredients[index] = value;
	}
</script>

<RecipeFormCard>
	{#snippet children()}
		<div class="mb-4 flex items-center justify-between">
			<h2 class="prose text-xl font-semibold">Ingredients</h2>
			<Button type="button" variant="outline" size="sm" onclick={addIngredient}>
				<Plus class="mr-2 h-4 w-4" />
				Add Ingredient
			</Button>
		</div>
		<Form.Field {form} name="ingredients">
			<Form.Control>
				{#snippet children({ props })}
					<div class="space-y-4">
						{#each $formData.ingredients as ingredient, i}
							<div class="flex items-start gap-2">
								<div class="flex-1 space-y-2">
									<Form.Label for="ingredient-{i}" class="sr-only">Ingredient {i + 1}</Form.Label>
									<Input
										{...props}
										id="ingredient-{i}"
										name={props.name}
										placeholder="e.g. 1 cup flour"
										value={ingredient}
										oninput={(e) => updateIngredient(i, e.currentTarget.value)}
									/>
								</div>

								<Button
									type="button"
									variant="ghost"
									size="icon"
									onclick={() => removeIngredient(i)}
									disabled={$formData.ingredients.length === 1}
								>
									<Trash2 class="h-4 w-4" />
									<span class="sr-only">Remove ingredient</span>
								</Button>
							</div>
						{/each}
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	{/snippet}
</RecipeFormCard>
