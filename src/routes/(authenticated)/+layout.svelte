<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import { SidebarInset, SidebarProvider } from '$lib/components/ui/sidebar';

	const { children } = $props();
</script>

<SidebarProvider>
	<AppSidebar />
	<SidebarInset>
		<SiteHeader />
		{@render children()}
	</SidebarInset>
</SidebarProvider>
