<script lang="ts" module>
	import { routes } from '$lib/constants/routes';
	import AppLogo from './app-logo.svelte';
	import { page } from '$app/state';

	const data = {
		navMain: [
			{
				title: 'Getting Started',
				url: '#',
				items: [
					{
						title: 'Dashboard',
						url: routes.dashboard
					},
					{
						title: 'Recipes',
						url: routes.recipes
					}
				]
			}
		]
	};
</script>

<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root collapsible="icon" {...restProps} bind:ref>
	<Sidebar.Header class="p-5">
		<a href={routes.dashboard}>
			<AppLogo />
		</a>
	</Sidebar.Header>
	<Sidebar.Content>
		<!-- We create a Sidebar.Group for each parent. -->
		{#each data.navMain as group (group.title)}
			<Sidebar.Group>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton isActive={page.url.pathname === item.url}>
									{#snippet child({ props })}
										<a href={item.url} {...props}>{item.title}</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
