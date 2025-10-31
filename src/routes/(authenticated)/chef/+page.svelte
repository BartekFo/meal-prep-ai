<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import { authClient } from "$lib/auth/auth-client";
  import {
    ChatHeader,
    ChatInput,
    ChatMessage,
    SuggestedPrompts,
    ThinkingIndicator,
  } from "$lib/modules/chef/components";
  import { addChatRecipe } from "$lib/modules/recipes/chat/actions/add-chat-recipe";
  import type { RecipeToolOutput } from "$lib/modules/recipes/components/generated-recipe-card.svelte";
  import GeneratedRecipeCard from "$lib/modules/recipes/components/generated-recipe-card.svelte";

  let input = $state("");
  const chat = new Chat({});

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    chat.sendMessage({ text: input });
    input = "";
  }

  const session = authClient.useSession();

  const suggestedPrompts = [
    "Create a weekly meal plan for weight loss",
    "Suggest a quick dinner recipe with chicken",
    "What can I make with eggs and vegetables?",
    "Plan high-protein meals for muscle gain",
  ];

  function handlePromptClick(prompt: string) {
    input = prompt;
  }

  const userInitial = $derived(
    $session.data?.user?.name?.charAt(0).toUpperCase() ||
      $session.data?.user?.email?.charAt(0).toUpperCase() ||
      "U"
  );

  async function handleAddRecipe(
    toolCallId: string,
    recipe: RecipeToolOutput
  ): Promise<void> {
    const userId = $session.data?.user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const result = await addChatRecipe(recipe, userId);

    if (result.isErr()) {
      throw result.error;
    }

    await chat.addToolResult({
      toolCallId,
      tool: "generateRecipe",
      output: { success: true },
    });
  }
</script>

<svelte:head>
	<title>AI Chef - Meal Prep AI</title>
</svelte:head>

<div class="flex h-full flex-col">
	<ChatHeader />

	<!-- Chat Messages Area -->
	<div class="flex-1 overflow-y-auto px-6 py-6">
		<div class="mx-auto max-w-4xl space-y-6">
			{#if chat.messages.length === 0}
				<SuggestedPrompts prompts={suggestedPrompts} onPromptClick={handlePromptClick} />
			{/if}

			<!-- Messages -->
			{#each chat.messages as message, messageIndex (messageIndex)}
				{#if message.role === 'assistant'}
					{#each message.parts as part, partIndex (partIndex)}
						{#if part.type === 'tool-generateRecipe' && part.state === 'output-available' && part.output}
							<GeneratedRecipeCard
								recipe={part.output as RecipeToolOutput}
								toolCallId={part.toolCallId}
								toolState={part.state}
								onAddRecipe={handleAddRecipe}
							/>
						{/if}
					{/each}
					{@const textParts = message.parts.filter((p) => p.type === 'text')}
					{#if textParts.length > 0}
						<ChatMessage message={{ ...message, parts: textParts }} {userInitial} />
					{/if}
				{:else}
					<ChatMessage {message} {userInitial} />
				{/if}
			{/each}

			<!-- Thinking Indicator -->
			{#if chat.status === 'streaming' || chat.status === 'submitted'}
				<ThinkingIndicator />
			{/if}
		</div>
	</div>

	<ChatInput bind:value={input} onSubmit={handleSubmit} />
</div>
