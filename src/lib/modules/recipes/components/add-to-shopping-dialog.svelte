<script lang="ts">
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
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { ShoppingCart } from '@lucide/svelte';

	interface Props {
		ingredients: string[];
		onAdd?: (selectedIngredients: string[]) => void;
		isLoading?: boolean;
	}

	const { ingredients, onAdd, isLoading = false }: Props = $props();

	let open = $state(false);
	let selectedIngredients = $state(new Map<number, boolean>());

	function toggleIngredient(index: number) {
		const current = selectedIngredients.get(index) ?? false;
		selectedIngredients.set(index, !current);
		selectedIngredients = selectedIngredients;
	}

	function handleSelectAll() {
		const allSelected = ingredients.every((_, i) => selectedIngredients.get(i) ?? false);
		ingredients.forEach((_, i) => {
			selectedIngredients.set(i, !allSelected);
		});
		selectedIngredients = selectedIngredients;
	}

	function handleAdd() {
		const selected = ingredients.filter((_, i) => selectedIngredients.get(i) ?? false);
		if (selected.length > 0) {
			onAdd?.(selected);
			selectedIngredients.clear();
			selectedIngredients = selectedIngredients;
			open = false;
		}
	}

	const areAllSelected = $derived(
		ingredients.length > 0 && ingredients.every((_, i) => selectedIngredients.get(i) ?? false)
	);
	const selectedCount = $derived(ingredients.filter((_, i) => selectedIngredients.get(i) ?? false).length);
</script>

<Dialog bind:open>
	<DialogTrigger>
		<Button variant="outline" size="sm">
			<ShoppingCart class="mr-2 h-4 w-4" />
			Dodaj do listy
		</Button>
	</DialogTrigger>
	<DialogContent class="max-w-md">
		<DialogHeader>
			<DialogTitle>Dodaj składniki do listy zakupów</DialogTitle>
			<DialogDescription>
				Wybierz składniki, które chcesz dodać do swojej listy zakupów
			</DialogDescription>
		</DialogHeader>

		<div class="space-y-4">
			<div class="flex items-center gap-2 p-2 border-b">
				<Checkbox
					checked={areAllSelected}
					onchange={handleSelectAll}
					disabled={isLoading}
				/>
				<Label class="cursor-pointer flex-1">
					Zaznacz wszystko
				</Label>
				{#if selectedCount > 0}
					<span class="text-sm text-gray-600">({selectedCount})</span>
				{/if}
			</div>

		<div class="max-h-64 space-y-2 overflow-y-auto">
			{#each ingredients as ingredient, i (i)}
				<div class="flex items-start gap-2">
					<Checkbox
						checked={selectedIngredients.get(i) ?? false}
						onchange={() => toggleIngredient(i)}
						disabled={isLoading}
					/>
					<Label class="cursor-pointer flex-1 pt-1 text-sm">
						{ingredient}
					</Label>
				</div>
			{/each}
		</div>
		</div>

		<DialogFooter>
			<Button variant="outline" onclick={() => (open = false)} disabled={isLoading}>
				Anuluj
			</Button>
			<Button onclick={handleAdd} disabled={isLoading || selectedCount === 0}>
				{isLoading ? 'Dodawanie...' : `Dodaj (${selectedCount})`}
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
