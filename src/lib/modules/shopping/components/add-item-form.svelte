<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { Plus } from '@lucide/svelte';

	const units = ['piece', 'kg', 'g', 'l', 'ml', 'serving', 'package', 'liter'];

	let name = $state('');
	let quantity = $state(1);
	let unit = $state('piece');
	let submitting = $state(false);
</script>

<Card>
	<CardHeader>
		<CardTitle>Add Item</CardTitle>
	</CardHeader>
	<CardContent>
		<form
			method="POST"
			action="?/addItem"
			use:enhance={() => {
				submitting = true;
				return async ({ result, update }) => {
					await update();
					if (result.type === 'success') {
						name = '';
						quantity = 1;
						unit = 'piece';
						await invalidateAll();
					}
					submitting = false;
				};
			}}
			class="space-y-4"
		>
			<div>
				<Label for="item-name">Product Name</Label>
				<Input
					id="item-name"
					name="name"
					bind:value={name}
					placeholder="e.g. Milk, Pepper, Chicken..."
					required
					disabled={submitting}
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<Label for="item-quantity">Quantity</Label>
					<Input
						id="item-quantity"
						name="quantity"
						type="number"
						bind:value={quantity}
						min="1"
						disabled={submitting}
					/>
				</div>

				<div>
					<Label for="item-unit">Unit</Label>
					<Select type="single" bind:value={unit} disabled={submitting}>
						<SelectTrigger id="item-unit">
							{unit}
						</SelectTrigger>
						<SelectContent>
							{#each units as u (u)}
								<SelectItem value={u}>{u}</SelectItem>
							{/each}
						</SelectContent>
					</Select>
					<input type="hidden" name="unit" value={unit} />
				</div>
			</div>

			<Button type="submit" class="w-full" disabled={submitting || !name.trim()}>
				<Plus class="mr-2 h-4 w-4" />
				{submitting ? 'Adding...' : 'Add'}
			</Button>
		</form>
	</CardContent>
</Card>
