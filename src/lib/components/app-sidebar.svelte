<script lang="ts" module>
	import { routes } from '$lib/constants/routes';
	import AppLogo from './app-logo.svelte';
	import { page } from '$app/state';
	import { authClient } from '$lib/auth/auth-client';

	const { data: session } = await authClient.getSession();

	const data = {
		navMain: [
			{
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
	import NavUser from './nav-user.svelte';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header class="p-5">
		<a href={routes.dashboard}>
			<AppLogo />
		</a>
	</Sidebar.Header>
	<Sidebar.Content>
		<!-- We create a Sidebar.Group for each parent. -->
		{#each data.navMain as group}
			<Sidebar.Group>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item}
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
	<Sidebar.Footer>
		<NavUser
			user={{
				name: session?.user?.name ?? '',
				email: session?.user?.email ?? ''
			}}
		/>
	</Sidebar.Footer>
</Sidebar.Root>
