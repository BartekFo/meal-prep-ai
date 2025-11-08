<script lang="ts">
	import {
		ArrowLeft,
		Clock,
		CookingPot,
		Minus,
		Plus,
		Printer,
		Trash2
	} from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from '$lib/components/ui/dialog';
	import { Separator } from '$lib/components/ui/separator';
	import { routes } from '$lib/constants/routes';
	import {
		RecipeIngredients,
		RecipeInstructions,
		RecipeNutrition,
		RecipeStatCard
	} from '$lib/modules/recipes';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	let dialogOpen = $state(false);
	let isDeleting = $state(false);

	const recipe = $derived(data.recipe);
	let currentPortions = $state(data.recipe.servings);
	const multiplier = $derived(currentPortions / recipe.servings);

	// Scaled cooking times (simple linear scaling for MVP)
	const scaledPrepTime = $derived(Math.round(recipe.prepTime * multiplier));
	const scaledCookTime = $derived(Math.round(recipe.cookTime * multiplier));
	const scaledTotalTime = $derived(
		recipe.cookTime === 0 ? scaledPrepTime : scaledPrepTime + scaledCookTime
	);

	function increasePortions() {
		currentPortions += 1;
	}

	function decreasePortions() {
		if (currentPortions > 1) {
			currentPortions -= 1;
		}
	}
</script>

<div class="container mx-auto max-w-5xl p-6">
	<div class="mb-6 flex items-center justify-between">
		<Button variant="ghost" size="sm" href={routes.recipes.base}>
			<ArrowLeft class="mr-2 h-4 w-4" />
			Back to Recipes
		</Button>
		<div class="flex gap-2">
			<Button href="/recipes/{data.recipe.id}/edit">Edit Recipe</Button>
			<Button variant="outline" size="sm" onclick={() => window.print()}>
				<Printer class="mr-2 h-4 w-4" />
				Print
			</Button>
			<Dialog bind:open={dialogOpen}>
				<DialogTrigger>
					<Button variant="destructive" size="sm">
						<Trash2 class="mr-2 h-4 w-4" />
						Delete
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Recipe</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete "{recipe.title}"? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onclick={() => (dialogOpen = false)}
							disabled={isDeleting}
						>
							Cancel
						</Button>
						<form method="POST" action="?/delete" use:enhance={() => {
							isDeleting = true;
							return async ({ update }) => {
								await update();
								isDeleting = false;
							};
						}}>
							<Button
								type="submit"
								variant="destructive"
								disabled={isDeleting}
							>
								{isDeleting ? 'Deleting...' : 'Delete Recipe'}
							</Button>
						</form>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	</div>

	<div class="relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
		{#if recipe.imageUrl}
			<img src={`/${recipe.imageUrl}`} alt={recipe.title} class="h-full w-full object-cover" />
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

		<!-- Portion Controls -->
		<div class="mt-4 flex items-center gap-3">
			<span class="text-sm font-medium">Portions:</span>
			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					size="icon"
					class="h-8 w-8"
					onclick={decreasePortions}
					disabled={currentPortions <= 1}
				>
					<Minus class="h-4 w-4" />
					<span class="sr-only">Decrease portions</span>
				</Button>
				<span class="min-w-8 text-center font-medium">{currentPortions}</span>
				<Button variant="outline" size="icon" class="h-8 w-8" onclick={increasePortions}>
					<Plus class="h-4 w-4" />
					<span class="sr-only">Increase portions</span>
				</Button>
			</div>
			{#if currentPortions !== recipe.servings}
				<span class="text-muted-foreground text-sm">(Original: {recipe.servings})</span>
			{/if}
		</div>
	</div>

	<div class="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
		<RecipeStatCard icon={Clock} label="Prep Time" value={scaledPrepTime} unit=" min" />
		<RecipeStatCard icon={Clock} label="Cook Time" value={scaledCookTime} unit=" min" />
		<RecipeStatCard icon={Clock} label="Total Time" value={scaledTotalTime} unit=" min" />
		<RecipeStatCard label="Servings" value={currentPortions} />
	</div>

	<RecipeNutrition
		calories={recipe.calories}
		protein={recipe.protein}
		carbs={recipe.carbs}
		fat={recipe.fat}
		{multiplier}
	/>

	<Separator class="my-8" />

	<div class="grid h-fit gap-8 md:grid-cols-2">
		<div class="h-full">
			<RecipeIngredients ingredients={recipe.ingredients} {multiplier} />
		</div>
		<div class="h-full">
			<RecipeInstructions instructions={recipe.instructions} />
		</div>
	</div>
</div>
