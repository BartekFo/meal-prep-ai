<script lang="ts">
	import { SidebarInset, SidebarProvider } from '$lib/components/ui/sidebar';
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { Separator } from '$lib/components/ui/separator/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import { page } from '$app/state';
	import SiteHeader from '$lib/components/site-header.svelte';

	let { children } = $props();
</script>

<SidebarProvider>
	<AppSidebar />
	<SidebarInset>
		<SiteHeader />
		{@render children()}
	</SidebarInset>
</SidebarProvider>
