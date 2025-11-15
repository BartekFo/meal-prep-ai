<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { LocalStorage } from '$lib/hooks/local-storage';
	import { cn } from '$lib/utils';
	import type { Chat } from '@ai-sdk/svelte';
	import { ArrowUp, SquarePause } from '@lucide/svelte';
	import type { User } from 'better-auth';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { innerWidth } from 'svelte/reactivity/window';

	let {
		user,
		chatClient,
		class: c
	}: {
		user: User | undefined;
		chatClient: Chat;
		class?: string;
	} = $props();

	let input = $state('');

	let textareaRef = $state<HTMLTextAreaElement | null>(null);
	const storedInput = new LocalStorage('input', '');
	const loading = $derived(chatClient.status === 'streaming' || chatClient.status === 'submitted');

	const adjustHeight = () => {
		if (textareaRef) {
			textareaRef.style.height = 'auto';
			textareaRef.style.height = `${textareaRef.scrollHeight + 2}px`;
		}
	};

	const resetHeight = () => {
		if (textareaRef) {
			textareaRef.style.height = 'auto';
			textareaRef.style.height = '98px';
		}
	};

	function setInput(value: string) {
		input = value;
		adjustHeight();
	}

	async function submitForm() {
		if (user) {
			replaceState(resolve(`/(authenticated)/api/chats/[id]`, { id: chatClient.id }), {});
		}

		await chatClient.sendMessage({ text: input });
		input = '';

		resetHeight();

		if (innerWidth.current && innerWidth.current > 768) {
			textareaRef?.focus();
		}
	}

	onMount(() => {
		input = storedInput.value;
		adjustHeight();
	});

	$effect.pre(() => {
		storedInput.value = input;
	});
</script>

<div class="relative flex w-full flex-col gap-4">
	<!-- {#if mounted && chatClient.messages.length === 0}
		<SuggestedActions {user} {chatClient} />
	{/if} -->

	<Textarea
		bind:ref={textareaRef}
		placeholder="Send a message..."
		bind:value={() => input, setInput}
		class={cn(
			'bg-muted max-h-[calc(75dvh)] min-h-[24px] resize-none overflow-hidden rounded-2xl pb-10 !text-base dark:border-zinc-700',
			c
		)}
		rows={2}
		autofocus
		onkeydown={(event) => {
			if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
				event.preventDefault();

				if (loading) {
					toast.error('Please wait for the model to finish its response!');
				} else {
					submitForm();
				}
			}
		}}
	/>

	<div class="absolute right-0 bottom-0 flex w-fit flex-row justify-end p-2">
		{#if loading}
			{@render stopButton()}
		{:else}
			{@render sendButton()}
		{/if}
	</div>
</div>

{#snippet stopButton()}
	<Button
		class="h-fit rounded-full border p-1.5 dark:border-zinc-600"
		onclick={(event) => {
			event.preventDefault();
			stop();
			chatClient.messages = chatClient.messages;
		}}
	>
		<SquarePause size={14} />
	</Button>
{/snippet}

{#snippet sendButton()}
	<Button
		class="h-fit rounded-full border p-1.5 dark:border-zinc-600"
		onclick={(event) => {
			event.preventDefault();
			submitForm();
		}}
		disabled={input.length === 0}
	>
		<ArrowUp size={14} />
	</Button>
{/snippet}
