<script lang="ts">
	import { Chat } from '$lib/modules/chef/components';
	import { convertToUIMessages } from '$lib/modules/chef/utils';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>AI Chef - Meal Prep AI</title>
</svelte:head>

<Chat
	chat={data.chat}
	initialMessages={convertToUIMessages(data.messages)}
	isMobile={data.isMobile}
/>
