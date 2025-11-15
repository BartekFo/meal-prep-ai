<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Loader, Trash2 } from '@lucide/svelte';
	import type { Memory } from './types';

	let {
		memory,
		isDeleting = false,
		onDelete
	}: {
		memory: Memory;
		isDeleting?: boolean;
		onDelete: (id: string) => void;
	} = $props();

	function formatDate(dateString?: string) {
		if (!dateString) return '';
		try {
			return new Date(dateString).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
		} catch {
			return '';
		}
	}

	function getSourceBadgeVariant(source?: string) {
		switch (source) {
			case 'profile':
				return 'default';
			case 'chat':
				return 'secondary';
			case 'manual':
				return 'outline';
			default:
				return 'secondary';
		}
	}
</script>

<div class="group relative rounded-lg border bg-card p-4 transition-colors hover:border-primary/50">
	<div class="flex items-start justify-between gap-3">
		<div class="flex-1 space-y-2">
			<p class="text-sm leading-relaxed">{memory.memory}</p>
			<div class="flex flex-wrap items-center gap-2">
				{#if memory.metadata?.source}
					<Badge variant={getSourceBadgeVariant(memory.metadata.source)}>
						{memory.metadata.source}
					</Badge>
				{/if}
				{#if memory.metadata?.type}
					<Badge variant="outline" class="text-xs">
						{memory.metadata.type}
					</Badge>
				{/if}
				{#if memory.created_at}
					<span class="text-xs text-muted-foreground">
						{formatDate(memory.created_at)}
					</span>
				{/if}
			</div>
		</div>
		<Button
			variant="ghost"
			size="icon"
			class="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
			onclick={() => onDelete(memory.id)}
			disabled={isDeleting}
		>
			{#if isDeleting}
				<Loader class="size-4 animate-spin" />
			{:else}
				<Trash2 class="size-4" />
			{/if}
			<span class="sr-only">Delete memory</span>
		</Button>
	</div>
</div>
