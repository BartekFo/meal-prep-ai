<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import type { ShoppingItem } from '$lib/server/db/schema';
	import { Trash2 } from '@lucide/svelte';

	interface Props {
		item: ShoppingItem;
		selected?: boolean;
		onSelectionChange?: ((id: number, selected: boolean) => void) | undefined;
	}

	const { item, selected = false, onSelectionChange = undefined }: Props = $props();

	let isDeleting = $state(false);
	let checked = $state(selected);
	let isUserChange = $state(false);

	$effect(() => {
		if (!isUserChange) {
			checked = selected;
		}
		isUserChange = false;
	});

	$effect(() => {
		if (checked !== selected) {
			isUserChange = true;
			onSelectionChange?.(item.id, checked);
		}
	});
</script>

<div class="flex items-center gap-3 rounded-lg border bg-white p-3 hover:bg-gray-50">
	<Checkbox bind:checked disabled={isDeleting} />

	<div class="flex-1 min-w-0">
		<p class={`font-medium ${checked ? 'line-through text-gray-500' : ''}`}>
			{item.name}
		</p>
		<p class="text-sm text-gray-600">
			{item.quantity}
			{item.unit}
		</p>
	</div>

	<form
		method="POST"
		action="?/deleteItem"
		use:enhance={() => {
			isDeleting = true;
			return async ({ result, update }) => {
				await update();
				if (result.type === 'success') {
					await invalidateAll();
				}
				isDeleting = false;
			};
		}}
	>
		<input type="hidden" name="id" value={item.id} />
		<Button
			type="submit"
			variant="ghost"
			size="sm"
			disabled={isDeleting}
			class="text-red-600 hover:text-red-700 hover:bg-red-50"
		>
			<Trash2 class="h-4 w-4" />
			<span class="sr-only">Delete</span>
		</Button>
	</form>
</div>
