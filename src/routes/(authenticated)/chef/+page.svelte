<script lang="ts">
  import { authClient } from "$lib/auth/auth-client";
  import {
    ChatHeader,
    ChatInput,
    ChatMessage,
    SuggestedPrompts,
    ThinkingIndicator,
  } from "$lib/modules/chef/components";
  import { Chat } from "@ai-sdk/svelte";

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
				<ChatMessage {message} {userInitial} />
			{/each}

			<!-- Thinking Indicator -->
			{#if chat.status === 'streaming' || chat.status === 'submitted'}
				<ThinkingIndicator />
			{/if}
		</div>
	</div>

	<ChatInput bind:value={input} onSubmit={handleSubmit} />
</div>
