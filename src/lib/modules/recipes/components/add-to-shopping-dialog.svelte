<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label';
	import { ShoppingCart } from '@lucide/svelte';
	import IngredientCheckbox from './ingredient-checkbox.svelte';

	interface Props {
		ingredients: string[];
		onAdd?: (selectedIngredients: string[]) => void;
		isLoading?: boolean;
	}

	const { ingredients, onAdd, isLoading = false }: Props = $props();

	let open = $state(false);
	let selectedIngredients = $state<boolean[]>([]);

	$effect(() => {
		if (open && selectedIngredients.length !== ingredients.length) {
			selectedIngredients = new Array(ingredients.length).fill(false);
		}
	});

	function handleIngredientChange(index: number, selected: boolean) {
		selectedIngredients[index] = selected;
		selectedIngredients = [...selectedIngredients];
	}

	function handleSelectAll() {
		const allSelected = selectedIngredients.every((checked) => checked);
		selectedIngredients = selectedIngredients.map(() => !allSelected);
	}

	function handleAdd() {
		const selected = ingredients.filter((_, i) => selectedIngredients[i]);
		if (selected.length > 0) {
			onAdd?.(selected);
			selectedIngredients = new Array(ingredients.length).fill(false);
			open = false;
		}
	}

	const selectedCount = $derived(selectedIngredients.filter((selected) => selected).length);
	const selectAllChecked = $derived(
		ingredients.length > 0 && selectedIngredients.every((checked) => checked)
	);
</script>

<Dialog bind:open>
	<DialogTrigger>
		<Button variant="outline" size="sm">
			<ShoppingCart class="mr-2 h-4 w-4" />
			Add to List
		</Button>
	</DialogTrigger>
	<DialogContent class="max-w-md">
		<DialogHeader>
			<DialogTitle>Add Ingredients to Shopping List</DialogTitle>
			<DialogDescription>
				Select the ingredients you want to add to your shopping list
			</DialogDescription>
		</DialogHeader>

		<div class="space-y-4">
			<div class="flex items-center gap-2 p-2 border-b">
				<Label
					class="flex items-center gap-2 cursor-pointer flex-1"
					onclick={() => {
						if (!isLoading) {
							handleSelectAll();
						}
					}}
				>
					<Checkbox checked={selectAllChecked} disabled={isLoading} />
					<span>Select All</span>
				</Label>
				{#if selectedCount > 0}
					<span class="text-sm text-gray-600">({selectedCount})</span>
				{/if}
			</div>

			<div class="max-h-64 space-y-2 overflow-y-auto">
				{#each ingredients as ingredient, i (ingredient)}
					<IngredientCheckbox
						{ingredient}
						index={i}
						selected={selectedIngredients[i] ?? false}
						onSelectionChange={handleIngredientChange}
						disabled={isLoading}
					/>
				{/each}
			</div>
		</div>

		<DialogFooter>
			<Button variant="outline" onclick={() => (open = false)} disabled={isLoading}>Cancel</Button>
			<Button onclick={handleAdd} disabled={isLoading || selectedCount === 0}>
				{isLoading ? 'Adding...' : `Add (${selectedCount})`}
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
