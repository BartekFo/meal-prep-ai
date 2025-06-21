<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form/index';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Plus, Trash2 } from '@lucide/svelte';
	import RecipeFormCard from './recipe-form-card.svelte';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { IRecipeFormValues } from '../schema';

	interface Props {
		form: SuperForm<IRecipeFormValues>;
	}

	const { form }: Props = $props();

	const { form: formData } = form;

	function addInstruction() {
		if (!$formData.instructions) {
			$formData.instructions = [];
		}
		$formData.instructions = [...$formData.instructions, ''];
	}

	function removeInstruction(index: number) {
		if ($formData.instructions.length > 1) {
			$formData.instructions = $formData.instructions.filter((_, i) => i !== index);
		}
	}

	function updateInstruction(index: number, value: string) {
		$formData.instructions[index] = value;
	}
</script>

<RecipeFormCard>
	{#snippet children()}
		<div class="mb-4 flex items-center justify-between">
			<h2 class="prose text-xl font-semibold">Instructions</h2>
			<Button type="button" variant="outline" size="sm" onclick={addInstruction}>
				<Plus class="mr-2 h-4 w-4" />
				Add Step
			</Button>
		</div>
		<Form.Field {form} name="instructions">
			<Form.Control>
				{#snippet children({ props })}
					<div class="space-y-4">
						{#each $formData.instructions as instruction, i}
							<div class="flex items-start gap-2">
								<div class="flex-1 space-y-2">
									<Form.Label for="instruction-{i}" class="sr-only">Step {i + 1}</Form.Label>
									<Textarea
										{...props}
										id="instruction-{i}"
										name={props.name}
										minlength={2}
										required
										placeholder="Describe this step"
										class="min-h-[80px]"
										value={instruction}
										oninput={(e) => updateInstruction(i, e.currentTarget.value)}
									/>
								</div>

								<Button
									type="button"
									variant="ghost"
									size="icon"
									onclick={() => removeInstruction(i)}
									disabled={$formData.instructions.length === 1}
								>
									<Trash2 class="h-4 w-4" />
									<span class="sr-only">Remove step</span>
								</Button>
							</div>
						{/each}
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	{/snippet}
</RecipeFormCard>
