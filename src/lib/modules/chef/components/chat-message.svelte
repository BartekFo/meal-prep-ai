<script lang="ts">
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { Card } from '$lib/components/ui/card';
	import type { UIMessage } from '@ai-sdk/svelte';
	import { ChefHat } from '@lucide/svelte';
	import { marked } from 'marked';

	type Props = {
		message: UIMessage;
		userInitial?: string;
	};

	let { message, userInitial = 'U' }: Props = $props();
</script>

<div class="flex gap-3 {message.role === 'user' ? 'justify-end' : 'justify-start'}">
	{#if message.role === 'assistant'}
		<Avatar class="size-8 shrink-0">
			<AvatarFallback class="bg-primary/10 text-primary">
				<ChefHat class="size-4" />
			</AvatarFallback>
		</Avatar>
	{/if}

	<div class="flex max-w-[80%] flex-col gap-1">
		<Card class="p-4 {message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}">
			{#each message.parts as part (part)}
				{#if part.type === 'text'}
					<p class="text-sm leading-relaxed">{@html marked(part.text)}</p>
				{/if}
			{/each}
		</Card>
	</div>

	{#if message.role === 'user'}
		<Avatar class="size-8 shrink-0">
			<AvatarFallback class="bg-accent text-accent-foreground">
				{userInitial}
			</AvatarFallback>
		</Avatar>
	{/if}
</div>
