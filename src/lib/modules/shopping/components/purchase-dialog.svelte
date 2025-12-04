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
		onOpenChange?: (open: boolean) => void;
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

<Dialog {open} onOpenChange>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Produkt zakupiony</DialogTitle>
			<DialogDescription>
				Podaj datę ważności produktu (opcjonalnie). Zostanie dodany do Twojej lodówki.
			</DialogDescription>
		</DialogHeader>

		<div class="space-y-4">
			<div>
				<Label for="expiry-date">Data ważności</Label>
				<Input
					id="expiry-date"
					type="date"
					bind:value={expiryDate}
					disabled={isLoading}
				/>
				<p class="mt-1 text-xs text-gray-500">Opcjonalne - jeśli nie podasz, produkt będzie w lodówce bez daty</p>
			</div>
		</div>

		<DialogFooter>
			<Button variant="outline" onclick={() => onOpenChange?.(false)} disabled={isLoading}>
				Anuluj
			</Button>
			<Button onclick={handleConfirm} disabled={isLoading}>
				{isLoading ? 'Przenosisz...' : 'Przenieś do lodówki'}
			</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
