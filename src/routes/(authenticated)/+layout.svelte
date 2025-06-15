<script lang="ts">
	import { SidebarInset, SidebarProvider } from '$lib/components/ui/sidebar';
	import AppSidebar from '$lib/components/app-sidebar.svelte';

	let { children } = $props();
</script>

<SidebarProvider>
	<AppSidebar />
	<SidebarInset>{@render children()}</SidebarInset>
</SidebarProvider>
