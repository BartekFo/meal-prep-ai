<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Plus, Trash2 } from '@lucide/svelte';
	import RecipeFormCard from './recipe-form-card.svelte';

	interface Props {
		form: any; // TODO: Type this with proper superforms types
		errors: any;
		constraints: any;
	}

	let { form, errors, constraints }: Props = $props();

	function addIngredient() {
		if (!$form.ingredients) {
			$form.ingredients = [];
		}
		$form.ingredients.push('');
	}

	function removeIngredient(index: number) {
		if ($form.ingredients.length > 1) {
			$form.ingredients.splice(index, 1);
			$form.ingredients = $form.ingredients; // Trigger reactivity
		}
	}

	function updateIngredient(index: number, value: string) {
		$form.ingredients[index] = value;
	}

	// Initialize with one empty ingredient if none exist
	$effect(() => {
		if (!$form.ingredients || $form.ingredients.length === 0) {
			$form.ingredients = [''];
		}
	});
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
		<div class="space-y-4">
			{#each $form.ingredients as ingredient, i}
				<div class="flex items-start gap-2">
					<div class="flex-1 space-y-2">
						<Label for="ingredient-{i}" class="sr-only">Ingredient {i + 1}</Label>
						<Input
							id="ingredient-{i}"
							name="ingredients[{i}]"
							placeholder="e.g. 1 cup flour"
							value={ingredient}
							oninput={(e) => updateIngredient(i, e.currentTarget.value)}
							aria-invalid={$errors.ingredients?.[i] ? 'true' : undefined}
						/>
						{#if $errors.ingredients?.[i]}
							<p class="text-destructive text-sm">{$errors.ingredients[i]}</p>
						{/if}
					</div>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						onclick={() => removeIngredient(i)}
						disabled={$form.ingredients.length === 1}
					>
						<Trash2 class="h-4 w-4" />
						<span class="sr-only">Remove ingredient</span>
					</Button>
				</div>
			{/each}
		</div>
	{/snippet}
</RecipeFormCard>
