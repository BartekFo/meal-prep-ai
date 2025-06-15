<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Plus } from '@lucide/svelte';
	import { routes } from '$lib/constants/routes';
	import RecipesFilters from '$lib/modules/recipes/components/recipes-filters.svelte';
</script>

<div class="flex h-full flex-col">
	<div class="flex items-center justify-between border-b px-6 py-4">
		<h1 class="text-2xl font-semibold">Recipes</h1>
		<Button href={routes.recipes.new}>
			<Plus class="mr-2 h-4 w-4" />
			Add Recipe
		</Button>
	</div>
	<div class="flex-1 overflow-auto p-6">
		<RecipesFilters />
		<!-- <RecipeList /> -->
	</div>
</div>
