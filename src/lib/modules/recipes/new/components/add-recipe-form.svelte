<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import { Button } from "$lib/components/ui/button";
  import type { IRecipeFormValues } from "../schema";
  import IngredientsFields from "./ingredients-fields.svelte";
  import InstructionsFields from "./instructions-fields.svelte";
  import NutritionInformationFields from "./nutrition-information-fields.svelte";
  import RecipeDetailsFields from "./recipe-details-fields.svelte";

  type Props = {
    data: {
      form: IRecipeFormValues;
    };
  };

  const { data }: Props = $props();

  const form = superForm(data.form, {
    resetForm: false,
    taintedMessage: false,
    onUpdated: ({ form: updatedForm }) => {
      if (updatedForm.message) {
        // TODO: Handle form submission success
      }
    },
  });

  const { message, submitting, enhance } = form;

  function handleCancel() {
    // TODO: Navigate to recipes page
  }
</script>

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
		<Button variant="outline" type="button" onclick={handleCancel}>Cancel</Button>
		<Button type="submit" disabled={$submitting}>
			{$submitting ? 'Saving...' : 'Save Recipe'}
		</Button>
	</div>
</form>
