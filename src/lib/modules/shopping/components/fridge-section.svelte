<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { AlertCircle, Trash2 } from '@lucide/svelte';
	import type { ShoppingItem } from '$lib/server/db/schema';

	interface FridgeItem extends ShoppingItem {
		expiryStatus?: 'fresh' | 'expiring' | 'expired';
	}

	interface Props {
		items: FridgeItem[];
		onRemove?: (id: number) => void;
		isLoading?: boolean;
	}

	const { items, onRemove, isLoading = false }: Props = $props();

	function formatDate(date: Date | null | undefined): string {
		if (!date) return 'Bez daty';
		return new Date(date).toLocaleDateString('pl-PL', {
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
				return 'Świeży';
			case 'expiring':
				return 'Wkrótce przeterminuje się';
			case 'expired':
				return 'Przeterminowany';
			default:
				return 'Bez daty';
		}
	}
</script>

<Card>
	<CardHeader>
		<CardTitle>Moja lodówka</CardTitle>
	</CardHeader>
	<CardContent>
		{#if items.length === 0}
			<div class="flex flex-col items-center justify-center py-8 text-center">
				<AlertCircle class="mb-3 h-8 w-8 text-gray-400" />
				<p class="text-gray-600">Twoja lodówka jest pusta</p>
				<p class="mt-1 text-sm text-gray-500">Zaznacz produkty z listy zakupów aby je dodać</p>
			</div>
		{:else}
			<div class="space-y-2">
				{#each items as item (item.id)}
					<div class={`flex items-start justify-between rounded-lg border p-4 ${getStatusColor(item.expiryStatus)}`}>
						<div class="flex-1 min-w-0">
							<p class="font-medium">{item.name}</p>
							<p class="text-sm text-gray-600">
								{item.quantity}
								{item.unit}
							</p>
							<p class="mt-1 text-xs text-gray-600">
								Ważny do: {formatDate(item.expiryDate)}
							</p>
							<p class={`mt-1 text-xs font-medium ${
								item.expiryStatus === 'expired'
									? 'text-red-700'
									: item.expiryStatus === 'expiring'
										? 'text-yellow-700'
										: 'text-green-700'
							}`}>
								{getStatusLabel(item.expiryStatus)}
							</p>
						</div>

						<Button
							variant="ghost"
							size="sm"
							onclick={() => onRemove?.(item.id)}
							disabled={isLoading}
							class="text-red-600 hover:text-red-700 hover:bg-red-100 ml-2 flex-shrink-0"
						>
							<Trash2 class="h-4 w-4" />
							<span class="sr-only">Remove from fridge</span>
						</Button>
					</div>
				{/each}
			</div>
		{/if}
	</CardContent>
</Card>
