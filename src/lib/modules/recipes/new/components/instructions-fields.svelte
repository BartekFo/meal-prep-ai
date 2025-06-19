<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Plus, Trash2 } from '@lucide/svelte';
	import RecipeFormCard from './recipe-form-card.svelte';

	interface Props {
		form: any; // TODO: Type this with proper superforms types
		errors: any;
		constraints: any;
	}

	let { form, errors, constraints }: Props = $props();

	function addInstruction() {
		if (!$form.instructions) {
			$form.instructions = [];
		}
		$form.instructions.push('');
	}

	function removeInstruction(index: number) {
		if ($form.instructions.length > 1) {
			$form.instructions.splice(index, 1);
			$form.instructions = $form.instructions; // Trigger reactivity
		}
	}

	function updateInstruction(index: number, value: string) {
		$form.instructions[index] = value;
	}

	// Initialize with one empty instruction if none exist
	$effect(() => {
		if (!$form.instructions || $form.instructions.length === 0) {
			$form.instructions = [''];
		}
	});
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
		<div class="space-y-4">
			{#each $form.instructions as instruction, i}
				<div class="flex items-start gap-2">
					<div class="flex-1 space-y-2">
						<Label for="instruction-{i}" class="sr-only">Step {i + 1}</Label>
						<Textarea
							id="instruction-{i}"
							name="instructions[{i}]"
							placeholder="Describe this step"
							class="min-h-[80px]"
							value={instruction}
							oninput={(e) => updateInstruction(i, e.currentTarget.value)}
							aria-invalid={$errors.instructions?.[i] ? 'true' : undefined}
						/>
						{#if $errors.instructions?.[i]}
							<p class="text-destructive text-sm">{$errors.instructions[i]}</p>
						{/if}
					</div>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						onclick={() => removeInstruction(i)}
						disabled={$form.instructions.length === 1}
					>
						<Trash2 class="h-4 w-4" />
						<span class="sr-only">Remove step</span>
					</Button>
				</div>
			{/each}
		</div>
	{/snippet}
</RecipeFormCard>
