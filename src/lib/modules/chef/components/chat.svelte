<script lang="ts">
	import { authClient } from '$lib/auth/auth-client';
	import {
		ChatHeader,
		ChatHistorySidebar,
		ChatInput,
		ChatMessage,
		ProposedMemoryCard,
		SuggestedPrompts,
		ThinkMessage
	} from '$lib/modules/chef/components';
	import type { ProposedMemoryOutput } from '$lib/modules/chef/components/memory/types';
	import type { RecipeToolOutput } from '$lib/modules/recipes/chat/types';
	import GeneratedRecipeCard from '$lib/modules/recipes/components/generated-recipe-card.svelte';
	import { Chat, type UIMessage } from '@ai-sdk/svelte';
	import { untrack } from 'svelte';

	type Props = {
		chatId: string;
		initialMessages: UIMessage[];
		isMobile?: boolean;
	};

	const { chatId, initialMessages, isMobile = false }: Props = $props();

	const chat = $derived(
		new Chat({
			id: chatId,
			generateId: crypto.randomUUID.bind(crypto),
			messages: untrack(() => initialMessages)
		})
	);

	const session = authClient.useSession();

	const suggestedPrompts = [
		'Create a weekly meal plan for weight loss',
		'Suggest a quick dinner recipe with chicken',
		'What can I make with eggs and vegetables?',
		'Plan high-protein meals for muscle gain'
	];

	function handlePromptClick(prompt: string) {
		chat.sendMessage({ text: prompt });
	}

	const userInitial = $derived(
		$session.data?.user?.name?.charAt(0).toUpperCase() ||
			$session.data?.user?.email?.charAt(0).toUpperCase() ||
			'U'
	);

	async function handleAddRecipe(toolCallId: string, recipe: RecipeToolOutput): Promise<void> {
		await chat.sendMessage({
			text: `Please add the recipe "${recipe.title}" to my recipes`
		});
	}

	async function handleConfirmMemory(memory: ProposedMemoryOutput): Promise<void> {
		await chat.sendMessage({
			text: `Please save this memory: "${memory.content}"`
		});
	}
</script>

<svelte:head>
	<title>AI Chef - Meal Prep AI</title>
</svelte:head>

<div class="flex h-full">
	<ChatHistorySidebar {isMobile} />

	<div class="flex flex-1 flex-col">
		<ChatHeader />

		<!-- Chat Messages Area -->
		<div class="flex-1 overflow-y-auto px-6 py-6">
			<div class="mx-auto max-w-4xl space-y-6">
				{#key chatId}
					{#if chat.messages.length === 0}
						<SuggestedPrompts prompts={suggestedPrompts} onPromptClick={handlePromptClick} />
					{/if}

					<!-- Messages -->
					{#each chat.messages as message, messageIndex (messageIndex)}
						{#if message.role === 'assistant'}
							{@const hasRecipeCard = message.parts.some(
								(p) =>
									p.type === 'tool-generateRecipe' && p.state === 'output-available' && p.output
							)}
							{#each message.parts as part, partIndex (partIndex)}
								{#if part.type === 'tool-generateRecipe'}
									{#if part.state === 'output-available' && part.output}
										<GeneratedRecipeCard
											recipe={part.output as RecipeToolOutput}
											toolCallId={part.toolCallId}
											toolState={part.state}
											onAddRecipe={handleAddRecipe}
										/>
									{:else if part.state === 'input-streaming' || part.state === 'input-available'}
										<div class="text-sm text-muted-foreground">Generating recipe...</div>
									{/if}
								{:else if part.type === 'tool-proposeMemory'}
									{#if part.state === 'output-available' && part.output}
										<ProposedMemoryCard
											memory={part.output as ProposedMemoryOutput}
											toolState={part.state}
											onConfirm={handleConfirmMemory}
										/>
									{/if}
								{/if}
							{/each}
							{@const textParts = message.parts.filter((p) => p.type === 'text')}
							{#if textParts.length > 0 && !hasRecipeCard}
								<ChatMessage message={{ ...message, parts: textParts }} {userInitial} />
							{/if}
						{:else}
							<ChatMessage {message} {userInitial} />
						{/if}
					{/each}

					{#if chat.status === 'streaming' || chat.status === 'submitted'}
						<ThinkMessage />
					{/if}
				{/key}
			</div>
		</div>

		<div class="px-6 py-6">
			<ChatInput user={$session.data?.user} chatClient={chat} />
		</div>
	</div>
</div>
