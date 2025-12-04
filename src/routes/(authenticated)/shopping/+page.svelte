<script lang="ts">
	import {
		AddItemForm,
		FridgeSection,
		PurchaseDialog,
		ShoppingList
	} from '$lib/modules/shopping/components';
	import { ChefHat } from '@lucide/svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	let shoppingItems = $state(data.shoppingItems);
	let fridgeItems = $state(data.fridgeItems);
	let isLoading = $state(false);
	let showPurchaseDialog = $state(false);
	let purchasingItemId: number | null = $state(null);

	async function handleAddItem(item: { name: string; quantity: number; unit: string }) {
		isLoading = true;
		try {
			const response = await fetch('/api/shopping', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(item)
			});

			if (response.ok) {
				const { item: newItem } = await response.json();
				shoppingItems = [...shoppingItems, newItem];
			}
		} catch (error) {
			console.error('Error adding item:', error);
		} finally {
			isLoading = false;
		}
	}

	async function handleDeleteItem(id: number) {
		isLoading = true;
		try {
			const response = await fetch(`/api/shopping/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				shoppingItems = shoppingItems.filter((item) => item.id !== id);
			}
		} catch (error) {
			console.error('Error deleting item:', error);
		} finally {
			isLoading = false;
		}
	}

	async function handlePurchaseItem(id: number) {
		purchasingItemId = id;
		showPurchaseDialog = true;
	}

	async function handleConfirmPurchase(expiryDate?: Date) {
		if (!purchasingItemId) return;

		isLoading = true;
		try {
			const response = await fetch(`/api/shopping/${purchasingItemId}/purchase`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ expiryDate })
			});

			if (response.ok) {
				const { item } = await response.json();
				shoppingItems = shoppingItems.filter((i) => i.id !== purchasingItemId);
				fridgeItems = [...fridgeItems, { ...item, expiryStatus: 'fresh' }];
				showPurchaseDialog = false;
				purchasingItemId = null;
			}
		} catch (error) {
			console.error('Error marking as purchased:', error);
		} finally {
			isLoading = false;
		}
	}

	async function handleRemoveFromFridge(id: number) {
		isLoading = true;
		try {
			const response = await fetch(`/api/shopping/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				fridgeItems = fridgeItems.filter((item) => item.id !== id);
			}
		} catch (error) {
			console.error('Error removing from fridge:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="container mx-auto max-w-6xl space-y-8 px-4 py-8">
	<div class="mb-8">
		<h1 class="mb-2 flex items-center gap-2 text-3xl font-bold">
			<ChefHat class="h-8 w-8" />
			My Shopping
		</h1>
		<p class="text-gray-600">Manage your shopping list and track your fridge contents</p>
	</div>

	<div class="grid gap-8 lg:grid-cols-3">
		<div class="lg:col-span-2 space-y-8">
			<AddItemForm {isLoading} onAddItem={handleAddItem} />
			<ShoppingList
				items={shoppingItems}
				onDelete={handleDeleteItem}
				onPurchase={handlePurchaseItem}
				{isLoading}
			/>
		</div>

		<div>
			<FridgeSection items={fridgeItems} onRemove={handleRemoveFromFridge} {isLoading} />
		</div>
	</div>

	<PurchaseDialog
		open={showPurchaseDialog}
		onOpenChange={(open) => (showPurchaseDialog = open)}
		{isLoading}
		onConfirm={handleConfirmPurchase}
	/>
</div>
