<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Loader, Plus } from '@lucide/svelte';

	let {
		value = $bindable(''),
		isSubmitting = false,
		onSubmit
	}: {
		value?: string;
		isSubmitting?: boolean;
		onSubmit: () => void;
	} = $props();

	function handleSubmit() {
		if (value.trim()) {
			onSubmit();
		}
	}
</script>

<div class="shrink-0 space-y-3 border-t px-4 py-4">
	<div class="flex items-center gap-2">
		<Plus class="size-4" />
		<Label for="new-memory" class="text-sm font-semibold">Add New Memory</Label>
	</div>
	<Textarea
		id="new-memory"
		bind:value
		placeholder="Add a memory for the AI to remember (e.g., 'I prefer low-carb meals' or 'I'm allergic to shellfish')..."
		rows={3}
		class="resize-none"
	/>
	<Button onclick={handleSubmit} disabled={!value.trim() || isSubmitting} class="w-full">
		{#if isSubmitting}
			<Loader class="mr-2 size-4 animate-spin" />
			Adding...
		{:else}
			<Plus class="mr-2 size-4" />
			Add Memory
		{/if}
	</Button>
</div>
