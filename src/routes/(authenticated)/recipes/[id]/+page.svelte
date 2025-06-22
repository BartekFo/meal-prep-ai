<script lang="ts">
	import { ArrowLeft, Clock, CookingPot, Printer, Share2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import {
		RecipeIngredients,
		RecipeInstructions,
		RecipeNutrition,
		RecipeStatCard
	} from '$lib/modules/recipes';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let recipe = $derived(data.recipe);
	let totalTime = $derived(
		recipe.cookTime === 0 ? `${recipe.prepTime} min` : `${recipe.prepTime + recipe.cookTime} min`
	);
</script>

<div class="container mx-auto max-w-5xl p-6">
	<div class="mb-6 flex items-center justify-between">
		<Button variant="ghost" size="sm" href="/recipes">
			<ArrowLeft class="mr-2 h-4 w-4" />
			Back to Recipes
		</Button>
		<div class="flex gap-2">
			<Button variant="outline" size="sm">
				<Printer class="mr-2 h-4 w-4" />
				Print
			</Button>
			<Button variant="outline" size="sm">
				<Share2 class="mr-2 h-4 w-4" />
				Share
			</Button>
		</div>
	</div>

	<div class="relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
		{#if recipe.imageUrl}
			<img src={recipe.imageUrl} alt={recipe.title} class="h-full w-full object-cover" />
		{:else}
			<div class="flex h-full flex-col items-center justify-center gap-2">
				<CookingPot class="h-12 w-12" />
				<span>No image provided</span>
			</div>
		{/if}
		<Badge class="absolute top-4 right-4 capitalize">
			{recipe.mealType}
		</Badge>
	</div>

	<div class="mb-8">
		<h1 class="mb-2 text-3xl font-bold">{recipe.title}</h1>
		<p class="text-muted-foreground text-lg">{recipe.description || ''}</p>
	</div>

	<div class="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
		<RecipeStatCard icon={Clock} label="Prep Time" value={recipe.prepTime} unit=" min" />
		<RecipeStatCard icon={Clock} label="Cook Time" value={recipe.cookTime} unit=" min" />
		<RecipeStatCard label="Total Time" value={totalTime} />
		<RecipeStatCard label="Servings" value={recipe.servings} />
	</div>

	<RecipeNutrition
		calories={recipe.calories}
		protein={recipe.protein}
		carbs={recipe.carbs}
		fat={recipe.fat}
	/>

	<Separator class="my-8" />

	<div class="grid gap-8 md:grid-cols-2">
		<RecipeIngredients ingredients={recipe.ingredients} defaultServings={recipe.servings} />
		<RecipeInstructions instructions={recipe.instructions} />
	</div>
</div>
