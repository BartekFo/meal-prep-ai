<script lang="ts">
	import SidebarIcon from '@lucide/svelte/icons/sidebar';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import ModeToggle from './mode-toggle.svelte';

	import { page } from '$app/state';

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

	const sidebar = Sidebar.useSidebar();
</script>

<header class="bg-background sticky top-0 z-50 flex h-16 w-full items-center gap-2 border-b px-4">
	<Button class="size-8" variant="ghost" size="icon" onclick={sidebar.toggle}>
		<SidebarIcon />
	</Button>
	<Separator orientation="vertical" class="mr-2 h-1/3!" />
	<Breadcrumb.Root>
		<Breadcrumb.List>
			{#each breadcrumbs as breadcrumb, index (breadcrumb.href)}
				<Breadcrumb.Item class={index === 0 ? 'hidden md:block' : ''}>
					{#if breadcrumb.isLast}
						<Breadcrumb.Page>{breadcrumb.label}</Breadcrumb.Page>
					{:else}
						<Breadcrumb.Link href={breadcrumb.href}>{breadcrumb.label}</Breadcrumb.Link>
					{/if}
				</Breadcrumb.Item>
				{#if !breadcrumb.isLast}
					<Breadcrumb.Separator class={index === 0 ? 'hidden md:block' : ''} />
				{/if}
			{/each}
		</Breadcrumb.List>
	</Breadcrumb.Root>
	<div class="ml-auto">
		<ModeToggle />
	</div>
</header>
