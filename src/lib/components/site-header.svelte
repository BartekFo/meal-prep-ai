<script lang="ts">
import SidebarIcon from '@lucide/svelte/icons/sidebar';
import { page } from '$app/state';
import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
import { Button } from '$lib/components/ui/button/index.js';
import { Separator } from '$lib/components/ui/separator/index.js';
import * as Sidebar from '$lib/components/ui/sidebar/index.js';
import ModeToggle from './mode-toggle.svelte';

const DASH_TO_SPACE_REGEX = /-/g;
const WORD_BOUNDARY_UPPERCASE_REGEX = /\b\w/g;
const DIGITS_ONLY_REGEX = /^\d+$/;

type PageData = {
  recipe?: { title?: string } | undefined;
};

type Crumb = { label: string; href: string; isLast: boolean };

function generateBreadcrumbs(pathname: string, pageData: PageData) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: Crumb[] = [];

  for (const [i, segment] of segments.entries()) {
    const href = `/${segments.slice(0, i + 1).join('/')}`;
    const isLast = i === segments.length - 1;

    let label = segment
      .replace(DASH_TO_SPACE_REGEX, ' ')
      .replace(WORD_BOUNDARY_UPPERCASE_REGEX, (char) => char.toUpperCase());

    if (segment === 'dashboard') {
      label = 'Dashboard';
    }
    if (segment === 'recipes') {
      label = 'Recipes';
    }

    if (
      (i > 0 ? segments[i - 1] : undefined) === 'recipes' &&
      DIGITS_ONLY_REGEX.test(segment) &&
      pageData?.recipe?.title
    ) {
      label = pageData.recipe.title ?? label;
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
