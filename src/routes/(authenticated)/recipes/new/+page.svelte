<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { routes } from '$lib/constants/routes';
	import {
		RecipeDetailsFields,
		IngredientsFields,
		InstructionsFields,
		NutritionInformationFields,
		type IRecipeFormValues
	} from '$lib/modules/recipes/new';

	import { ArrowLeft } from '@lucide/svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data }: { data: { form: IRecipeFormValues } } = $props();

	const form = superForm(data.form);

	const { message, enhance, submitting } = form;
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

	<form method="POST" use:enhance class="space-y-8">
		{#if $message}
			<div class="rounded-md border border-green-500 bg-green-50 p-4 text-green-700">
				{$message}
			</div>
		{/if}

		<RecipeDetailsFields {form} />
		<NutritionInformationFields {form} />
		<IngredientsFields {form} />
		<InstructionsFields {form} />

		<div class="flex justify-end gap-4">
			<Button variant="outline" type="button" href={routes.recipes.base}>Cancel</Button>
			<Button type="submit" disabled={$submitting}>
				{$submitting ? 'Saving...' : 'Save Recipe'}
			</Button>
		</div>
	</form>
</div>
