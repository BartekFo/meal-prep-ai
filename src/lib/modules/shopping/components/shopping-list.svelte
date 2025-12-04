<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import type { ShoppingItem as ShoppingItemType } from '$lib/server/db/schema';
	import { AlertCircle } from '@lucide/svelte';
	import ShoppingItem from './shopping-item.svelte';

	interface Props {
		items: ShoppingItemType[];
		onDelete?: (id: number) => void;
		onPurchase?: (id: number) => void;
		isLoading?: boolean;
	}

	const {
		items,
		onDelete = undefined,
		onPurchase = undefined,
		isLoading = false
	}: Props = $props();
</script>

<Card>
	<CardHeader>
		<CardTitle>Shopping List</CardTitle>
	</CardHeader>
	<CardContent>
		{#if items.length === 0}
			<div class="flex flex-col items-center justify-center py-8 text-center">
				<AlertCircle class="mb-3 h-8 w-8 text-gray-400" />
				<p class="text-gray-600">Your shopping list is empty</p>
				<p class="mt-1 text-sm text-gray-500">Add items to track them</p>
			</div>
		{:else}
			<div class="space-y-2">
				{#each items as item (item.id)}
					<ShoppingItem {item} {onDelete} {onPurchase} {isLoading} />
				{/each}
			</div>
		{/if}
	</CardContent>
</Card>
