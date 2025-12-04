<script lang="ts">
	import { routes } from '$lib/constants/routes';
	import AppLogo from './app-logo.svelte';
	import { page } from '$app/state';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import NavUser from './nav-user.svelte';
	import { authClient } from '$lib/auth/auth-client';
	import { resolve } from '$app/paths';

	const data = {
		navMain: [
			{
				items: [
					{
						title: 'Dashboard',
						url: routes.dashboard
					},
					{
						title: 'Chef',
						url: routes.chef
					},
					{
						title: 'Recipes',
						url: routes.recipes.base
					},
					{
						title: 'Shopping',
						url: routes.shopping
					}
				]
			}
		]
	};

	const session = authClient.useSession();

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header class="p-5">
		<a href={resolve('/(authenticated)/dashboard')}>
			<AppLogo />
		</a>
	</Sidebar.Header>
	<Sidebar.Content>
		<!-- We create a Sidebar.Group for each parent. -->
		{#each data.navMain as group, groupIdx (groupIdx)}
			<Sidebar.Group>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (item.url)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton isActive={page.url.pathname.includes(item.url)}>
									{#snippet child({ props })}
										<a href={resolve(item.url)} {...props}>{item.title}</a>
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
				name: $session?.data?.user?.name ?? '',
				email: $session?.data?.user?.email ?? ''
			}}
		/>
	</Sidebar.Footer>
</Sidebar.Root>
