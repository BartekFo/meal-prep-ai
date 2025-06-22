<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import type { Component } from 'svelte';

	let {
		icon,
		label,
		value,
		unit = ''
	}: {
		icon?: Component;
		label: string;
		value: string | number;
		unit?: string;
	} = $props();
</script>

<Card class="p-4 text-center">
	<div class="mb-1 flex items-center justify-center">
		{#if icon}
			<icon class="mr-1 h-4 w-4"></icon>
		{/if}
		<span class="text-sm font-medium">{label}</span>
	</div>
	<p class="text-lg font-semibold">{value}{unit}</p>
</Card>
