<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { ChatHistory } from '$lib/hooks/chat-history.svelte';
	import { cn } from '$lib/utils';
	import { MessageSquare, Plus, Trash2 } from '@lucide/svelte';
	import { isToday, isYesterday, subMonths, subWeeks } from 'date-fns';
	import { toast } from 'svelte-sonner';
	import type { Chat } from '../db/queries';

	interface Props {
		isMobile?: boolean;
	}

	let { isMobile = false }: Props = $props();

	const chatHistory = ChatHistory.fromContext();
	const groupedChats = $derived(groupChatsByDate(chatHistory.chats));

	let sheetOpen = $state(false);

	const currentChatId = $derived(page.params.chatId);

	type GroupedChats = {
		today: Chat[];
		yesterday: Chat[];
		lastWeek: Chat[];
		lastMonth: Chat[];
		older: Chat[];
	};

	const chatGroupTitles = {
		today: 'Today',
		yesterday: 'Yesterday',
		lastWeek: 'Last 7 days',
		lastMonth: 'Last 30 days',
		older: 'Older'
	} as const;

	function groupChatsByDate(chats: Chat[]): GroupedChats {
		const now = new Date();
		const oneWeekAgo = subWeeks(now, 1);
		const oneMonthAgo = subMonths(now, 1);

		return chats.reduce(
			(groups, chat) => {
				const chatDate = new Date(chat.createdAt);

				if (isToday(chatDate)) {
					groups.today.push(chat);
				} else if (isYesterday(chatDate)) {
					groups.yesterday.push(chat);
				} else if (chatDate > oneWeekAgo) {
					groups.lastWeek.push(chat);
				} else if (chatDate > oneMonthAgo) {
					groups.lastMonth.push(chat);
				} else {
					groups.older.push(chat);
				}

				return groups;
			},
			{
				today: [],
				yesterday: [],
				lastWeek: [],
				lastMonth: [],
				older: []
			} as GroupedChats
		);
	}

	async function handleNewChat() {
		await goto(resolve('/(authenticated)/chef'));
		if (isMobile) {
			sheetOpen = false;
		}
	}

	async function handleChatClick(chatId: string) {
		await goto(resolve(`/(authenticated)/chef/[chatId]`, { chatId }));
		if (isMobile) {
			sheetOpen = false;
		}
	}

	async function handleDeleteChat(chatId: string, event: MouseEvent) {
		event.stopPropagation();
		if (!confirm('Are you sure you want to delete this chat?')) {
			return;
		}

		const deletePromise = (async () => {
			const res = await fetch('/api/chat', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id: chatId })
			});
			if (!res.ok) {
				throw new Error();
			}
		})();

		toast.promise(deletePromise, {
			loading: 'Deleting chat...',
			success: () => {
				chatHistory.chats = chatHistory.chats.filter((chat) => chat.id !== chatId);
				chatHistory.refetch();
				return 'Chat deleted successfully';
			},
			error: 'Failed to delete chat'
		});

		if (currentChatId === chatId) {
			await goto(resolve('/(authenticated)/chef'));
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
			{#if chatHistory.chats.length === 0}
				<div class="text-muted-foreground p-4 text-center text-sm">
					Your conversations will appear here once you start chatting!
				</div>
			{:else}
				<div class="space-y-1">
					{#each Object.entries(groupedChats) as [group, chats] (group)}
						{#if chats.length > 0}
							<div class="text-sidebar-foreground/50 px-2 py-1 text-xs">
								{chatGroupTitles[group as keyof typeof chatGroupTitles]}
							</div>
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
						{/if}
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
