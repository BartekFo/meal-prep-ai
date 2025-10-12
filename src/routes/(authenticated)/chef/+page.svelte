<script lang="ts">
	import { ArrowUp, ChefHat, MessageSquare, Plus } from '@lucide/svelte';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { Card } from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as InputGroup from '$lib/components/ui/input-group';
	import { Separator } from '$lib/components/ui/separator';
	import { authClient } from '$lib/auth/auth-client';

	const session = authClient.useSession();

	// Mock messages for UI demonstration
	let messages = $state([
		{
			id: 1,
			role: 'ai',
			content: 'Hello! I\'m your AI chef assistant. I can help you create personalized meal plans, suggest recipes based on your preferences, and answer any cooking questions you might have. How can I help you today?',
			timestamp: new Date(Date.now() - 60000)
		}
	]);

	let inputValue = $state('');
	let selectedMode = $state('Auto');

	const suggestedPrompts = [
		'Create a weekly meal plan for weight loss',
		'Suggest a quick dinner recipe with chicken',
		'What can I make with eggs and vegetables?',
		'Plan high-protein meals for muscle gain'
	];

	function handleSend() {
		if (inputValue.trim()) {
			// Add user message
			messages = [
				...messages,
				{
					id: messages.length + 1,
					role: 'user',
					content: inputValue,
					timestamp: new Date()
				}
			];

			// Mock AI response
			setTimeout(() => {
				messages = [
					...messages,
					{
						id: messages.length + 1,
						role: 'ai',
						content: 'I\'d be happy to help you with that! (This is a UI demo - backend integration coming soon)',
						timestamp: new Date()
					}
				];
			}, 500);

			inputValue = '';
		}
	}

	function handlePromptClick(prompt: string) {
		inputValue = prompt;
	}

	function formatTime(date: Date) {
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
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
			{#if messages.length === 1}
				<!-- Suggested Prompts -->
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
			{#each messages as message (message.id)}
				<div class="flex gap-3 {message.role === 'user' ? 'justify-end' : 'justify-start'}">
					{#if message.role === 'ai'}
						<Avatar class="size-8 shrink-0">
							<AvatarFallback class="bg-primary/10 text-primary">
								<ChefHat class="size-4" />
							</AvatarFallback>
						</Avatar>
					{/if}

					<div class="flex max-w-[80%] flex-col gap-1">
						<Card class="p-4 {message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}">
							<p class="text-sm leading-relaxed">{message.content}</p>
						</Card>
						<span class="text-muted-foreground px-2 text-xs {message.role === 'user' ? 'text-right' : 'text-left'}">
							{formatTime(message.timestamp)}
						</span>
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

	<!-- Input Area -->
	<div class="border-t px-6 py-4">
		<div class="mx-auto max-w-4xl">
			<InputGroup.Root>
				<InputGroup.Textarea
					placeholder="Ask, Search or Chat..."
					bind:value={inputValue}
					onkeydown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							handleSend();
						}
					}}
					rows={1}
					class="max-h-32 min-h-[2.5rem] resize-none"
				/>
				<InputGroup.Addon align="block-end">
					<InputGroup.Button variant="outline" class="size-7 rounded-full" size="icon">
						<Plus class="size-4" />
						<span class="sr-only">Add attachment</span>
					</InputGroup.Button>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<InputGroup.Button {...props} variant="ghost">
									{selectedMode}
								</InputGroup.Button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content side="top" align="start" class="[--radius:0.95rem]">
							<DropdownMenu.Item onclick={() => (selectedMode = 'Auto')}>
								Auto
							</DropdownMenu.Item>
							<DropdownMenu.Item onclick={() => (selectedMode = 'Agent')}>
								Agent
							</DropdownMenu.Item>
							<DropdownMenu.Item onclick={() => (selectedMode = 'Manual')}>
								Manual
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
					<InputGroup.Text class="ml-auto">52% used</InputGroup.Text>
					<Separator orientation="vertical" class="!h-4" />
					<InputGroup.Button
						variant="default"
						class="size-7 rounded-full"
						size="icon"
						disabled={!inputValue.trim()}
						onclick={handleSend}
					>
						<ArrowUp class="size-4" />
						<span class="sr-only">Send</span>
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	</div>
</div>
