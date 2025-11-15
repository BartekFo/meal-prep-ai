<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Brain, ChefHat } from '@lucide/svelte';
	import { MemoryDrawer } from './memory';

	let memoryDrawerOpen = $state(false);
</script>

<div class="border-b px-6 py-4">
	<div class="mx-auto max-w-4xl">
		<div class="flex items-center justify-between gap-3">
			<div class="flex items-center gap-3">
				<div class="bg-primary/10 flex size-10 items-center justify-center rounded-full">
					<ChefHat class="text-primary size-5" />
				</div>
				<div>
					<h1 class="text-foreground text-xl font-bold">AI Chef Assistant</h1>
					<p class="text-muted-foreground text-sm">
						Your personal cooking companion for meal planning and recipes
					</p>
				</div>
			</div>
			<Button
				variant="ghost"
				onclick={() => (memoryDrawerOpen = true)}
				title="Manage Memories"
				class="gap-2"
			>
				<span>Memory</span>
				<Brain class="size-5" />
			</Button>
		</div>
	</div>
</div>

<MemoryDrawer bind:open={memoryDrawerOpen} />
