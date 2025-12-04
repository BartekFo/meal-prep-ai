<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Plus } from '@lucide/svelte';

	interface Props {
		onAddItem?: (item: { name: string; quantity: number; unit: string }) => void;
		isLoading?: boolean;
	}

	const { onAddItem, isLoading = false }: Props = $props();

	const units = ['szt', 'kg', 'g', 'l', 'ml', 'porcja', 'opakowanie', 'litr'];

	let name = $state('');
	let quantity = $state(1);
	let unit = $state('szt');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!name.trim()) return;

		onAddItem?.({
			name: name.trim(),
			quantity: Math.max(1, quantity),
			unit
		});

		name = '';
		quantity = 1;
		unit = 'szt';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSubmit(e as unknown as SubmitEvent);
		}
	}
</script>

<Card>
	<CardHeader>
		<CardTitle>Add Item</CardTitle>
	</CardHeader>
	<CardContent>
		<form onsubmit={handleSubmit} class="space-y-4">
			<div>
				<Label for="item-name">Product Name</Label>
				<Input
					id="item-name"
					bind:value={name}
					placeholder="e.g. Milk, Pepper, Chicken..."
					onkeydown={handleKeydown}
					disabled={isLoading}
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<Label for="item-quantity">Quantity</Label>
					<Input
						id="item-quantity"
						type="number"
						bind:value={quantity}
						min="1"
						disabled={isLoading}
					/>
				</div>

				<div>
					<Label for="item-unit">Unit</Label>
					<Select type="single" bind:value={unit} disabled={isLoading}>
						<SelectTrigger id="item-unit">
							{unit}
						</SelectTrigger>
						<SelectContent>
							{#each units as u (u)}
								<SelectItem value={u}>{u}</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				</div>
			</div>

			<Button type="submit" class="w-full" disabled={isLoading || !name.trim()}>
				<Plus class="mr-2 h-4 w-4" />
				{isLoading ? 'Adding...' : 'Add'}
			</Button>
		</form>
	</CardContent>
</Card>
