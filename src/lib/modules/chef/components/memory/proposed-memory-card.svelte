<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Brain, X } from '@lucide/svelte';
	import type { ProposedMemoryOutput } from './types';

	type Props = {
		memory: ProposedMemoryOutput;
		toolState: 'input-streaming' | 'input-available' | 'output-available' | 'output-error';
		onConfirm?: (memory: ProposedMemoryOutput) => Promise<void>;
	};

	let { memory, toolState, onConfirm }: Props = $props();

	let isRejected = $state(false);

	function handleConfirm() {
		if (onConfirm) {
			onConfirm(memory);
		}
	}

	function handleReject() {
		isRejected = true;
	}
</script>

{#if !isRejected}
	<Card class="border-primary/20 bg-primary/5">
		<CardHeader class="pb-3">
			<div class="flex items-start justify-between gap-2">
				<div class="flex items-center gap-2">
					<div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
						<Brain class="size-4 text-primary" />
					</div>
					<CardTitle class="text-base">Save to Memory?</CardTitle>
				</div>
				<Button variant="ghost" size="icon" class="size-6" onclick={handleReject}>
					<X class="size-3" />
					<span class="sr-only">Dismiss</span>
				</Button>
			</div>
			<CardDescription class="pl-10">{memory.context}</CardDescription>
		</CardHeader>

		<CardContent class="pb-3 pl-10">
			<p class="text-sm leading-relaxed">{memory.content}</p>
		</CardContent>

		{#if toolState === 'output-available'}
			<CardFooter class="flex gap-2 pl-10 pt-0">
				<Button size="sm" onclick={handleConfirm} type="button" class="flex-1">Save Memory</Button>
				<Button size="sm" variant="outline" onclick={handleReject} type="button">Dismiss</Button>
			</CardFooter>
		{/if}
	</Card>
{/if}
