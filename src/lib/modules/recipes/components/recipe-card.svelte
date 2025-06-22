<script lang="ts">
	import { Clock, CookingPot } from '@lucide/svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import type { Recipe } from '../types';
	import NutritionItem from './nutrition-item.svelte';

	export let recipe: Recipe;

	$: totalTime = `${recipe.prepTime} prep · ${recipe.cookTime} cook`;
</script>

<Card class="overflow-hidden transition-all hover:shadow-md">
	<div class="relative aspect-video">
		{#if recipe.imageUrl}
			<img src={recipe.imageUrl} alt={recipe.title} class="h-full w-full object-cover" />
		{:else}
			<div class="flex h-full flex-col items-center justify-center gap-2">
				<CookingPot class="h-12 w-12" />
				<span>No image provided</span>
			</div>
		{/if}
		<Badge class="absolute top-2 right-2 capitalize">
			{recipe.mealType}
		</Badge>
	</div>
	<CardHeader class="p-4">
		<CardTitle class="line-clamp-1">{recipe.title}</CardTitle>
		<CardDescription class="line-clamp-2">
			{recipe.description || 'No description provideds'}
		</CardDescription>
	</CardHeader>
	<CardContent class="prose p-4 pt-0">
		<p class="text-muted-foreground flex items-center text-sm">
			<Clock class="mr-1 h-4 w-4" />
			<span>{totalTime}</span>
		</p>
		<div class="mt-4 flex justify-between">
			<NutritionItem value={recipe.calories} label="Calories" variant="compact" />
			<NutritionItem value={recipe.protein} unit="g" label="Protein" variant="compact" />
			<NutritionItem value={recipe.carbs} unit="g" label="Carbs" variant="compact" />
			<NutritionItem value={recipe.fat} unit="g" label="Fat" variant="compact" />
		</div>
	</CardContent>
	<CardFooter class="p-4 pt-0">
		<Button variant="outline" class="w-full" href="/recipes/{recipe.id}">View Recipe</Button>
	</CardFooter>
</Card>
