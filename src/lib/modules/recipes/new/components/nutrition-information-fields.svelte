<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import RecipeFormCard from './recipe-form-card.svelte';

	// TODO: Replace with actual form handling
	let nutritionData = $state({
		calories: '',
		protein: '',
		carbs: '',
		fat: ''
	});

	// TODO: Replace with actual form validation
	let errors = $state({
		calories: '',
		protein: '',
		carbs: '',
		fat: ''
	});
</script>

<RecipeFormCard>
	{#snippet children()}
		<h2 class="prose mb-4 text-xl font-semibold">Nutrition Information</h2>
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
			<div class="space-y-2">
				<Label for="calories">Calories</Label>
				<Input
					id="calories"
					name="calories"
					placeholder="0"
					type="number"
					min="0"
					bind:value={nutritionData.calories}
				/>
				{#if errors.calories}
					<p class="text-destructive text-sm">{errors.calories}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="protein">Protein (g)</Label>
				<Input
					id="protein"
					name="protein"
					placeholder="0"
					type="number"
					min="0"
					bind:value={nutritionData.protein}
				/>
				{#if errors.protein}
					<p class="text-destructive text-sm">{errors.protein}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="carbs">Carbs (g)</Label>
				<Input
					id="carbs"
					name="carbs"
					type="number"
					min="0"
					placeholder="0"
					bind:value={nutritionData.carbs}
				/>
				{#if errors.carbs}
					<p class="text-destructive text-sm">{errors.carbs}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="fat">Fat (g)</Label>
				<Input
					id="fat"
					name="fat"
					type="number"
					min="0"
					placeholder="0"
					bind:value={nutritionData.fat}
				/>
				{#if errors.fat}
					<p class="text-destructive text-sm">{errors.fat}</p>
				{/if}
			</div>
		</div>
	{/snippet}
</RecipeFormCard>
