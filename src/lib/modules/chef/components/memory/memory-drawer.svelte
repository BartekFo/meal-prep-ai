<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Brain } from '@lucide/svelte';
	import AddMemoryForm from './add-memory-form.svelte';
	import MemoryList from './memory-list.svelte';
	import type { Memory } from './types';

	let { open = $bindable(false) } = $props();

	let memories = $state<Memory[]>([]);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let newMemoryContent = $state('');
	let addingMemory = $state(false);
	let deletingIds = $state<Set<string>>(new Set());

	async function fetchMemories() {
		loading = true;
		error = null;
		try {
			const response = await fetch('/api/memories');
			if (!response.ok) {
				throw new Error('Failed to fetch memories');
			}
			const data = await response.json();
			memories = data.memories || [];
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to fetch memories';
			console.error('Error fetching memories:', err);
		} finally {
			loading = false;
		}
	}

	async function handleDeleteMemory(memoryId: string) {
		if (!confirm('Are you sure you want to delete this memory?')) {
			return;
		}

		deletingIds.add(memoryId);
		deletingIds = deletingIds;

		try {
			const response = await fetch(`/api/memories/${memoryId}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Failed to delete memory');
			}

			memories = memories.filter((m) => m.id !== memoryId);
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Failed to delete memory');
			console.error('Error deleting memory:', err);
		} finally {
			deletingIds.delete(memoryId);
			deletingIds = deletingIds;
		}
	}

	async function handleAddMemory() {
		if (!newMemoryContent.trim()) {
			return;
		}

		addingMemory = true;
		try {
			const response = await fetch('/api/memories', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					content: newMemoryContent
				})
			});

			if (!response.ok) {
				throw new Error('Failed to add memory');
			}

			newMemoryContent = '';
			await fetchMemories();
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Failed to add memory');
			console.error('Error adding memory:', err);
		} finally {
			addingMemory = false;
		}
	}

	$effect(() => {
		if (open) {
			fetchMemories();
		}
	});
</script>

<Drawer.Root bind:open direction="right">
	<Drawer.Content
		class="left-auto right-0 top-0 mt-0 flex h-screen w-full max-w-md flex-col rounded-none after:!h-0"
	>
		<div class="flex h-full w-full flex-col">
			<Drawer.Header class="shrink-0">
				<div class="flex items-center gap-2">
					<Brain class="size-5" />
					<Drawer.Title>Memory Management</Drawer.Title>
				</div>
				<Drawer.Description>
					View and manage memories that the AI assistant uses to personalize your experience.
				</Drawer.Description>
			</Drawer.Header>

			<div class="flex-1 overflow-y-auto px-4 pb-4">
				<MemoryList {memories} {loading} {error} {deletingIds} onDelete={handleDeleteMemory} />
			</div>

			<AddMemoryForm
				bind:value={newMemoryContent}
				isSubmitting={addingMemory}
				onSubmit={handleAddMemory}
			/>

			<Drawer.Footer class="mt-auto shrink-0">
				<Drawer.Close>
					<Button variant="outline" class="w-full">Close</Button>
				</Drawer.Close>
			</Drawer.Footer>
		</div>
	</Drawer.Content>
</Drawer.Root>
