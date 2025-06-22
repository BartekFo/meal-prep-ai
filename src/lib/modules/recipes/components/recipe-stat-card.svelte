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

	const Icon = icon;
</script>

<Card class="prose gap-0 p-4 text-center">
	<div class="mb-1 flex items-center justify-center">
		{#if icon}
			<Icon class="mr-1 h-4 w-4" />
		{/if}
		<span class="text-sm">{label}</span>
	</div>
	<p class="text-lg font-semibold">{value}{unit}</p>
</Card>
