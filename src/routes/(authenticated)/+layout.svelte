<script lang="ts">
	import { SidebarInset, SidebarProvider } from '$lib/components/ui/sidebar';
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { Separator } from '$lib/components/ui/separator/index';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';
	import { page } from '$app/state';
	import SiteHeader from '$lib/components/site-header.svelte';

	let { children } = $props();

	function generateBreadcrumbs(pathname: string, pageData: any) {
		const segments = pathname.split('/').filter(Boolean);
		const breadcrumbs = [];

		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i];
			const href = `/${segments.slice(0, i + 1).join('/')}`;
			const isLast = i === segments.length - 1;

			let label = segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

			if (segment === 'dashboard') label = 'Dashboard';
			if (segment === 'recipes') label = 'Recipes';

			if (segments[i - 1] === 'recipes' && /^\d+$/.test(segment) && pageData?.recipe?.title) {
				label = pageData.recipe.title;
			}

			breadcrumbs.push({ label, href, isLast });
		}

		return breadcrumbs;
	}

	const breadcrumbs = $derived(generateBreadcrumbs(page.url.pathname, page.data));
</script>

<SidebarProvider>
	<AppSidebar />
	<SidebarInset>
		<SiteHeader />
		{@render children()}
	</SidebarInset>
</SidebarProvider>
