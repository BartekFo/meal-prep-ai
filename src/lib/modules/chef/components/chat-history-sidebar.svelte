<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { routes } from '$lib/constants/routes';
	import { cn } from '$lib/utils';
	import { MessageSquare, Plus, Trash2 } from '@lucide/svelte';
	import type { Chat } from '../db/queries';

	interface Props {
		chats: Chat[];
		isMobile?: boolean;
	}

	let { chats, isMobile = false }: Props = $props();

	let sheetOpen = $state(false);

	const currentChatId = $derived(page.url.searchParams.get('chatId'));

	async function handleNewChat() {
		await goto(resolve(routes.chef));
		if (isMobile) {
			sheetOpen = false;
		}
	}

	async function handleChatClick(chatId: string) {
		await goto(resolve(`${routes.chef}?chatId=${chatId}`));
		if (isMobile) {
			sheetOpen = false;
		}
	}

	async function handleDeleteChat(chatId: string, event: MouseEvent) {
		event.stopPropagation();
		if (!confirm('Are you sure you want to delete this chat?')) {
			return;
		}

		try {
			const response = await fetch(`/api/chats/${chatId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				if (currentChatId === chatId) {
					await goto(resolve(routes.chef));
				}
				await invalidate('chef:chats');
			}
		} catch (error) {
			console.error('Failed to delete chat:', error);
		}
	}

	function formatDate(date: Date): string {
		const now = new Date();
		const chatDate = new Date(date);
		const diffMs = now.getTime() - chatDate.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays === 0) {
			return 'Today';
		}
		if (diffDays === 1) {
			return 'Yesterday';
		}
		if (diffDays < 7) {
			return `${diffDays} days ago`;
		}

		return chatDate.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
	}
</script>

{#snippet sidebarContent()}
	<div class="flex h-full flex-col border-r bg-background">
		<div class="border-b p-4">
			<Button variant="default" size="sm" class="w-full" onclick={handleNewChat} type="button">
				<Plus class="size-4" />
				New Chat
			</Button>
		</div>

		<div class="flex-1 overflow-y-auto p-2">
			{#if chats.length === 0}
				<div class="text-muted-foreground p-4 text-center text-sm">
					No chats yet. Start a new conversation!
				</div>
			{:else}
				<div class="space-y-1">
					{#each chats as chat (chat.id)}
						{@const isActive = currentChatId === chat.id}
						<div
							class={cn(
								'group flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
								isActive && 'bg-accent font-medium'
							)}
						>
							<button
								type="button"
								class="flex min-w-0 flex-1 items-center gap-2"
								onclick={() => handleChatClick(chat.id)}
							>
								<MessageSquare class="text-muted-foreground size-4 shrink-0" />
								<div class="min-w-0 flex-1">
									<div
										class={cn(
											'truncate text-sm',
											isActive ? 'text-foreground' : 'text-muted-foreground'
										)}
									>
										{chat.title}
									</div>
									<div class="text-muted-foreground text-xs">{formatDate(chat.createdAt)}</div>
								</div>
							</button>
							<button
								type="button"
								class="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
								onclick={(e) => handleDeleteChat(chat.id, e)}
								aria-label="Delete chat"
							>
								<Trash2 class="size-4" />
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/snippet}

{#if isMobile}
	<Sheet.Root bind:open={sheetOpen}>
		<Sheet.Trigger>
			<Button variant="ghost" size="icon" class="md:hidden" type="button">
				<MessageSquare class="size-4" />
			</Button>
		</Sheet.Trigger>
		<Sheet.Content side="left" class="w-[300px] p-0">
			{@render sidebarContent()}
		</Sheet.Content>
	</Sheet.Root>
{:else}
	<div class="hidden w-64 md:block">{@render sidebarContent()}</div>
{/if}
