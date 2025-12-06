<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	interface Props {
		ingredient: string;
		selected?: boolean;
		onSelectionChange?: ((index: number, selected: boolean) => void) | undefined;
		index: number;
		disabled?: boolean;
	}

	const { ingredient, selected = false, onSelectionChange = undefined, index, disabled = false }: Props =
		$props();
</script>

<Label
	class="flex items-center gap-2 cursor-pointer"
	onclick={() => {
		if (!disabled) {
			onSelectionChange?.(index, !selected);
		}
	}}
>
	<Checkbox checked={selected} {disabled} />
	<span class="flex-1 text-sm">{ingredient}</span>
</Label>
