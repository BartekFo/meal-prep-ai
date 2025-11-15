<script lang="ts">
	import { Brain, Loader } from '@lucide/svelte';
	import MemoryItem from './memory-item.svelte';
	import type { Memory } from './types';

	let {
		memories,
		loading = false,
		error = null,
		deletingIds = new Set(),
		onDelete
	}: {
		memories: Memory[];
		loading?: boolean;
		error?: string | null;
		deletingIds?: Set<string>;
		onDelete: (id: string) => void;
	} = $props();
</script>

{#if loading}
	<div class="flex items-center justify-center py-8">
		<Loader class="size-6 animate-spin text-muted-foreground" />
	</div>
{:else if error}
	<div class="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
		{error}
	</div>
{:else if memories.length === 0}
	<div class="py-8 text-center text-muted-foreground">
		<Brain class="mx-auto mb-2 size-12 opacity-50" />
		<p>No memories yet. Memories will be automatically saved from your conversations.</p>
	</div>
{:else}
	<div class="space-y-3">
		{#each memories as memory (memory.id)}
			<MemoryItem {memory} isDeleting={deletingIds.has(memory.id)} {onDelete} />
		{/each}
	</div>
{/if}
