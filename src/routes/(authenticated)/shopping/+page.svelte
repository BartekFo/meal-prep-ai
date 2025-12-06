<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import {
		AddItemForm,
		FridgeSection,
		PurchaseDialog,
		ShoppingHeader,
		ShoppingList
	} from '$lib/modules/shopping/components';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	let showPurchaseDialog = $state(false);
	let purchasingItemId: number | null = $state(null);

	function handlePurchaseItem(id: number) {
		purchasingItemId = id;
		showPurchaseDialog = true;
	}

	async function handleConfirmPurchase(expiryDate?: Date) {
		if (!purchasingItemId) return;

		const formData = new FormData();
		formData.append('id', purchasingItemId.toString());
		if (expiryDate) {
			formData.append('expiryDate', expiryDate.toISOString());
		}

		const response = await fetch('?/purchaseItem', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			await invalidateAll();
			showPurchaseDialog = false;
			purchasingItemId = null;
		}
	}
</script>

<div class="container mx-auto max-w-6xl space-y-8 px-4 py-8">
	<ShoppingHeader />
	<div class="grid gap-8 lg:grid-cols-3">
		<div class="lg:col-span-2 space-y-8">
			<AddItemForm data={{ form: data.form }} />
			<ShoppingList items={data.shoppingItems} onPurchase={handlePurchaseItem} />
		</div>

		<div>
			<FridgeSection items={data.fridgeItems} />
		</div>
	</div>

	<PurchaseDialog
		open={showPurchaseDialog}
		onOpenChange={(open) => (showPurchaseDialog = open)}
		onConfirm={handleConfirmPurchase}
	/>
</div>
