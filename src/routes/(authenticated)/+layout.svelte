<script lang="ts">
  import { page } from "$app/state";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import SiteHeader from "$lib/components/site-header.svelte";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index";
  import { Separator } from "$lib/components/ui/separator/index";
  import { SidebarInset, SidebarProvider } from "$lib/components/ui/sidebar";
  import * as Sidebar from "$lib/components/ui/sidebar/index";

  const { children } = $props();
</script>

<SidebarProvider>
	<AppSidebar />
	<SidebarInset>
		<SiteHeader />
		{@render children()}
	</SidebarInset>
</SidebarProvider>
