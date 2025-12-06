<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import type { ShoppingItem } from '$lib/server/db/schema';
	import { AlertCircle, Trash2 } from '@lucide/svelte';

	interface FridgeItem extends ShoppingItem {
		expiryStatus?: 'fresh' | 'expiring' | 'expired';
	}

	interface Props {
		items: FridgeItem[];
	}

	const { items }: Props = $props();

	function formatDate(date: Date | null | undefined): string {
		if (!date) return 'No date';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getStatusColor(status?: string): string {
		switch (status) {
			case 'fresh':
				return 'bg-green-50 border-green-200';
			case 'expiring':
				return 'bg-yellow-50 border-yellow-200';
			case 'expired':
				return 'bg-red-50 border-red-200';
			default:
				return 'bg-gray-50 border-gray-200';
		}
	}

	function getStatusLabel(status?: string): string {
		switch (status) {
			case 'fresh':
				return 'Fresh';
			case 'expiring':
				return 'Expiring soon';
			case 'expired':
				return 'Expired';
			default:
				return 'No date';
		}
	}
</script>

<Card>
	<CardHeader>
		<CardTitle>My Fridge</CardTitle>
	</CardHeader>
	<CardContent>
		{#if items.length === 0}
			<div class="flex flex-col items-center justify-center py-8 text-center">
				<AlertCircle class="mb-3 h-8 w-8 text-gray-400" />
				<p class="text-gray-600">Your fridge is empty</p>
				<p class="mt-1 text-sm text-gray-500">
					Check off items from your shopping list to add them
				</p>
			</div>
		{:else}
			<div class="space-y-2">
				{#each items as item (item.id)}
					<div
						class={`flex items-start justify-between rounded-lg border p-4 ${getStatusColor(item.expiryStatus)}`}
					>
						<div class="flex-1 min-w-0">
							<p class="font-medium">{item.name}</p>
							<p class="text-sm text-gray-600">
								{item.quantity}
								{item.unit}
							</p>
							<p class="mt-1 text-xs text-gray-600">
								Expires: {formatDate(item.expiryDate)}
							</p>
							<p
								class={`mt-1 text-xs font-medium ${
									item.expiryStatus === 'expired'
										? 'text-red-700'
										: item.expiryStatus === 'expiring'
											? 'text-yellow-700'
											: 'text-green-700'
								}`}
							>
								{getStatusLabel(item.expiryStatus)}
							</p>
						</div>

						<form
							method="POST"
							action="?/removeFromFridge"
							use:enhance={() => {
								return async ({ result, update }) => {
									await update();
									if (result.type === 'success') {
										await invalidateAll();
									}
								};
							}}
						>
							<input type="hidden" name="id" value={item.id} />
							<Button
								type="submit"
								variant="ghost"
								size="sm"
								class="text-red-600 hover:text-red-700 hover:bg-red-100 ml-2 flex-shrink-0"
							>
								<Trash2 class="h-4 w-4" />
								<span class="sr-only">Remove from fridge</span>
							</Button>
						</form>
					</div>
				{/each}
			</div>
		{/if}
	</CardContent>
</Card>
