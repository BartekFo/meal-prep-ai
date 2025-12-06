<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import type { ShoppingItem as ShoppingItemType } from '$lib/server/db/schema';
	import { CircleAlert, ShoppingCart } from '@lucide/svelte';
	import ShoppingItem from './shopping-item.svelte';

	interface Props {
		items: ShoppingItemType[];
	}

	const { items }: Props = $props();

	let selectedIds = $state<number[]>([]);
	let isSubmitting = $state(false);

	function handleSelectionChange(id: number, selected: boolean) {
		if (selected) {
			selectedIds = [...selectedIds, id];
		} else {
			selectedIds = selectedIds.filter((selectedId) => selectedId !== id);
		}
	}
</script>

<Card>
	<CardHeader>
		<CardTitle>Shopping List</CardTitle>
	</CardHeader>
	<CardContent>
		{#if items.length === 0}
			<div class="flex flex-col items-center justify-center py-8 text-center">
				<CircleAlert class="mb-3 h-8 w-8 text-gray-400" />
				<p class="text-gray-600">Your shopping list is empty</p>
				<p class="mt-1 text-sm text-gray-500">Add items to track them</p>
			</div>
		{:else}
			<div class="space-y-2">
				{#each items as item (item.id)}
					<ShoppingItem
						{item}
						selected={selectedIds.includes(item.id)}
						onSelectionChange={handleSelectionChange}
					/>
				{/each}
				{#if selectedIds.length > 0}
					<div class="pt-4 border-t">
						<form
							method="POST"
							action="?/purchaseItems"
							use:enhance={() => {
								isSubmitting = true;
								return async ({ result, update }) => {
									await update();
									if (result.type === 'success') {
										selectedIds = [];
										await invalidateAll();
									}
									isSubmitting = false;
								};
							}}
						>
							{#each selectedIds as id (id)}
								<input type="hidden" name="ids[]" value={id} />
							{/each}
							<Button type="submit" class="w-full" disabled={isSubmitting}>
								<ShoppingCart class="mr-2 h-4 w-4" />
								{isSubmitting
									? 'Adding...'
									: `Add ${selectedIds.length} ${selectedIds.length === 1 ? 'item' : 'items'} to Fridge`}
							</Button>
						</form>
					</div>
				{/if}
			</div>
		{/if}
	</CardContent>
</Card>
