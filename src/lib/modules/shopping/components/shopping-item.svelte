<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import type { ShoppingItem } from '$lib/server/db/schema';
	import { Trash2 } from '@lucide/svelte';

	interface Props {
		item: ShoppingItem;
		onDelete?: ((id: number) => void) | undefined;
		onPurchase?: ((id: number) => void) | undefined;
		isLoading?: boolean;
	}

	const { item, onDelete = undefined, onPurchase = undefined, isLoading = false }: Props = $props();

	let isChecked = $state(false);
	let isDeleting = $state(false);
</script>

<div class="flex items-center gap-3 rounded-lg border bg-white p-3 hover:bg-gray-50">
	<Checkbox
		checked={isChecked}
		onchange={(e) => {
			isChecked = (e.target as HTMLInputElement).checked;
			if (isChecked) {
				onPurchase?.(item.id);
			}
		}}
		disabled={isLoading || isDeleting}
	/>

	<div class="flex-1 min-w-0">
		<p class={`font-medium ${isChecked ? 'line-through text-gray-500' : ''}`}>
			{item.name}
		</p>
		<p class="text-sm text-gray-600">
			{item.quantity}
			{item.unit}
		</p>
	</div>

	<Button
		variant="ghost"
		size="sm"
		onclick={() => {
			isDeleting = true;
			onDelete?.(item.id);
		}}
		disabled={isLoading || isDeleting}
		class="text-red-600 hover:text-red-700 hover:bg-red-50"
	>
		<Trash2 class="h-4 w-4" />
		<span class="sr-only">Delete</span>
	</Button>
</div>
