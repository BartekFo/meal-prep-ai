<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { Button } from '$lib/components/ui/button';
	import IngredientsFields from './ingredients-fields.svelte';
	import InstructionsFields from './instructions-fields.svelte';
	import NutritionInformationFields from './nutrition-information-fields.svelte';
	import RecipeDetailsFields from './recipe-details-fields.svelte';

	interface Props {
		data: {
			form: any; // TODO: Type this properly when form types are generated
		};
	}

	let { data }: Props = $props();

	const { form, errors, constraints, message, enhance, submitting } = superForm(data.form, {
		resetForm: false,
		taintedMessage: false,
		onUpdated: ({ form }) => {
			if (form.message) {
				console.log('Form submitted successfully:', form.message);
			}
		}
	});

	function handleCancel() {
		// TODO: Navigate to recipes page
		console.log('Cancel navigation not implemented yet');
	}
</script>

<form method="POST" use:enhance class="space-y-8">
	{#if $message}
		<div class="rounded-md border border-green-500 bg-green-50 p-4 text-green-700">
			{$message}
		</div>
	{/if}

	<RecipeDetailsFields {form} {errors} {constraints} />
	<NutritionInformationFields {form} {errors} {constraints} />
	<IngredientsFields {form} {errors} {constraints} />
	<InstructionsFields {form} {errors} {constraints} />

	<div class="flex justify-end gap-4">
		<Button variant="outline" type="button" onclick={handleCancel}>Cancel</Button>
		<Button type="submit" disabled={$submitting}>
			{$submitting ? 'Saving...' : 'Save Recipe'}
		</Button>
	</div>
</form>
