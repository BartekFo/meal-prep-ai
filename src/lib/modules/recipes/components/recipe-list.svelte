<script lang="ts">
	import RecipeCard from './recipe-card.svelte';
	import type { Recipe } from '../types';

	let { recipes }: { recipes: Recipe[] } = $props();
</script>

{#if recipes.length === 0}
	<div class="py-10 text-center">No recipes found. Add some recipes to get started!</div>
{:else}
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each recipes as recipe (recipe.id)}
			<RecipeCard {recipe} />
		{/each}
	</div>
{/if}
