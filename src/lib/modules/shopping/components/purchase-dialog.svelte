<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	interface Props {
		open?: boolean;
		onOpenChange: (open: boolean) => void;
		onConfirm?: (expiryDate?: Date) => void;
		isLoading?: boolean;
	}

	const { open = false, onOpenChange, onConfirm, isLoading = false }: Props = $props();

	let expiryDate = $state('');

	function handleConfirm() {
		const date = expiryDate ? new Date(expiryDate) : undefined;
		onConfirm?.(date);
		expiryDate = '';
	}
</script>

<Dialog {open} onOpenChange={onOpenChange}>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Item Purchased</DialogTitle>
			<DialogDescription>
				Set the expiry date for this item (optional). It will be added to your fridge.
			</DialogDescription>
		</DialogHeader>

		<div class="space-y-4">
			<div>
				<Label for="expiry-date">Expiry Date</Label>
				<Input id="expiry-date" type="date" bind:value={expiryDate} disabled={isLoading} />
				<p class="mt-1 text-xs text-gray-500">
					Optional - if not set, the item will be stored without an expiry date
				</p>
			</div>
		</div>

		<DialogFooter>
			<Button variant="outline" onclick={() => onOpenChange?.(false)} disabled={isLoading}>
				Cancel
			</Button>
			<Button onclick={handleConfirm} disabled={isLoading}>
				{isLoading ? 'Moving...' : 'Move to Fridge'}
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
