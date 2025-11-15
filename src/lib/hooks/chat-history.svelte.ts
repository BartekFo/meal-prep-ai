import type { Chat } from '$lib/server/db/schema';
import { getContext, setContext } from 'svelte';
const contextKey = Symbol('ChatHistory');

export class ChatHistory {
	#loading = $state(false);
	#revalidating = $state(false);
	chats = $state<Chat[]>([]);

	get loading() {
		return this.#loading;
	}

	get revalidating() {
		return this.#revalidating;
	}

	constructor(chats: Chat[]) {
		this.#loading = true;
		this.#revalidating = true;
		this.chats = chats;
		this.#loading = false;
		this.#revalidating = false;
	}

	getChatDetails = (chatId: string) => {
		return this.chats.find((c) => c.id === chatId);
	};

	setContext() {
		setContext(contextKey, this);
	}

	async refetch() {
		this.#revalidating = true;
		try {
			const res = await fetch('/api/history');
			if (res.ok) {
				this.chats = await res.json();
			}
		} finally {
			this.#revalidating = false;
		}
	}

	static fromContext(): ChatHistory {
		return getContext(contextKey);
	}
}
