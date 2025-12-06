<script lang="ts">
	import {
		AddItemForm,
		FridgeSection,
		ShoppingHeader,
		ShoppingList
	} from '$lib/modules/shopping/components';
	import type { IShoppingItemFormValues } from '$lib/modules/shopping/schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<div class="container mx-auto max-w-6xl space-y-8 px-4 py-8">
	<ShoppingHeader />
	<div class="grid gap-8 lg:grid-cols-3">
		<div class="lg:col-span-2 space-y-8">
			<AddItemForm data={{ form: data.form as SuperValidated<IShoppingItemFormValues> }} />
			<ShoppingList items={data.shoppingItems} />
		</div>

		<div>
			<FridgeSection items={data.fridgeItems} />
		</div>
	</div>
</div>
