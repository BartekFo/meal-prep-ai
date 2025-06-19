<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { routes } from '$lib/constants/routes';
	import { ArrowLeft } from '@lucide/svelte';
</script>

<div class="container mx-auto max-w-5xl p-6">
	<div class="mb-6 flex items-center">
		<Button variant="ghost" size="sm" href={routes.recipes.base}>
			<ArrowLeft className="mr-2 h-4 w-4" />
			Back to Recipes
		</Button>
	</div>

	<div class="mb-6">
		<h1 class="text-3xl font-bold">Add New Recipe</h1>
		<p class="text-muted-foreground">
			Fill out the form below to add a new recipe to your collection.
		</p>
	</div>

	<!-- <AddRecipeForm /> -->
</div>
