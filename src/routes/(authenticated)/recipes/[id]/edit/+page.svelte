<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		RecipeDetailsFields,
		IngredientsFields,
		InstructionsFields,
		NutritionInformationFields,
		type IRecipeFormValues
	} from '$lib/modules/recipes/new';

	import { ArrowLeft } from '@lucide/svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data }: { data: { form: IRecipeFormValues; recipe: any } } = $props();

	const form = superForm(data.form, {
		clearOnSubmit: 'errors',
		onError: ({ result }) => {
			$message = result.error.message || 'Unknown error';
		}
	});

	const { message, enhance, submitting } = form;
</script>

<div class="container mx-auto max-w-5xl p-6">
	<div class="mb-6 flex items-center">
		<Button variant="ghost" size="sm" href="/recipes/{data.recipe.id}">
			<ArrowLeft className="mr-2 h-4 w-4" />
			Back to Recipe
		</Button>
	</div>

	<div class="prose mb-6">
		<h1>Edit Recipe</h1>
		<p class="text-muted-foreground">Update your recipe details below.</p>
	</div>

	<form method="POST" use:enhance class="space-y-8" enctype="multipart/form-data">
		{#if $message}
			<div class="rounded-md border border-red-50 bg-red-50 p-4 text-red-700">
				{$message}
			</div>
		{/if}

		<RecipeDetailsFields {form} />
		<NutritionInformationFields {form} />
		<IngredientsFields {form} />
		<InstructionsFields {form} />

		<div class="flex justify-end gap-4">
			<Button variant="outline" type="button" href="/recipes/{data.recipe.id}">Cancel</Button>
			<Button type="submit" disabled={$submitting}>
				{$submitting ? 'Updating...' : 'Update Recipe'}
			</Button>
		</div>
	</form>
</div>
