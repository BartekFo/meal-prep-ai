<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import { ArrowUp, ChefHat, MessageSquare, Plus } from "@lucide/svelte";
  import { authClient } from "$lib/auth/auth-client";
  import { Avatar, AvatarFallback } from "$lib/components/ui/avatar";
  import { Card } from "$lib/components/ui/card";
  import * as InputGroup from "$lib/components/ui/input-group";

  let input = "";
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

  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
</script>

<svelte:head>
	<title>AI Chef - Meal Prep AI</title>
</svelte:head>

<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="border-b px-6 py-4">
		<div class="mx-auto max-w-4xl">
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
		</div>
	</div>

	<!-- Chat Messages Area -->
	<div class="flex-1 overflow-y-auto px-6 py-6">
		<div class="mx-auto max-w-4xl space-y-6">
			{#if chat.messages.length === 0}
				<div class="space-y-4">
					<p class="text-muted-foreground text-center text-sm">
						Try one of these suggestions to get started:
					</p>
					<div class="grid gap-3 sm:grid-cols-2">
						{#each suggestedPrompts as prompt}
							<button
								type="button"
								onclick={() => handlePromptClick(prompt)}
								class="bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground group rounded-lg border p-4 text-left text-sm transition-colors"
							>
								<div class="flex items-start gap-3">
									<MessageSquare class="text-muted-foreground group-hover:text-accent-foreground mt-0.5 size-4 shrink-0" />
									<span>{prompt}</span>
								</div>
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Messages -->
    {#each chat.messages as message, messageIndex (messageIndex)}
				<div class="flex gap-3 {message.role === 'user' ? 'justify-end' : 'justify-start'}">
					{#if message.role === 'assistant'}
						<Avatar class="size-8 shrink-0">
							<AvatarFallback class="bg-primary/10 text-primary">
								<ChefHat class="size-4" />
							</AvatarFallback>
						</Avatar>
					{/if}

					<div class="flex max-w-[80%] flex-col gap-1">
						<Card class="p-2 {message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}">
							{#each message.parts as part, partIndex (partIndex)}
            {#if part.type === 'text'}
							<p class="text-sm leading-relaxed">{part.text}</p>
						{/if}
					{/each}
						</Card>
					</div>

					{#if message.role === 'user'}
						<Avatar class="size-8 shrink-0">
							<AvatarFallback class="bg-accent text-accent-foreground">
								{$session.data?.user?.name?.charAt(0).toUpperCase() || $session.data?.user?.email?.charAt(0).toUpperCase() || 'U'}
							</AvatarFallback>
						</Avatar>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div class="border-t px-6 py-4">
		<div class="mx-auto max-w-4xl">
			<form onsubmit={handleSubmit}>
			<InputGroup.Root>
				<InputGroup.Textarea
					placeholder="Ask, Search or Chat..."
					bind:value={input}
					rows={1}
					class="max-h-32 min-h-[2.5rem] resize-none"
				/>
				<InputGroup.Addon align="block-end">
					<InputGroup.Button
						variant="default"
						class="size-7 rounded-full"
						size="icon"
						disabled={!input.trim()}
						type="submit"
					>
						<ArrowUp class="size-4" />
						<span class="sr-only">Send</span>
					</InputGroup.Button>
					</InputGroup.Addon>
				</InputGroup.Root>
			</form>
		</div>
	</div>
</div>
