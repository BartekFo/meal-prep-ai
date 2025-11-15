<script lang="ts">
	import { Chat } from '$lib/modules/chef/components';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>AI Chef - Meal Prep AI</title>
</svelte:head>

<Chat chat={undefined} initialMessages={[]} isMobile={data.isMobile} />
