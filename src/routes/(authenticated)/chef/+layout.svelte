<script lang="ts">
	import { ChatHistory } from '$lib/hooks/chat-history.svelte.js';

	let { data, children } = $props();

	const chatHistory = new ChatHistory(data.chats);
	chatHistory.setContext();
</script>

{@render children?.()}
