<script lang="ts">
import { LogOut } from '@lucide/svelte';
import { authClient } from '$lib/auth/auth-client';
import AppLogo from '$lib/components/app-logo.svelte';
import ModeToggle from '$lib/components/mode-toggle.svelte';
import Button from '$lib/components/ui/button/button.svelte';

const { children } = $props();

async function handleLogout() {
  await authClient.signOut();
}
</script>

<div class="bg-muted/20 flex min-h-screen flex-col">
	<header class="bg-background sticky top-0 z-10 w-full border-b px-4 py-3 shadow-sm">
		<div class="mx-auto flex max-w-5xl items-center justify-between">
			<a href="/onboarding">
				<AppLogo />
			</a>
			<Button variant="ghost" class="flex items-center gap-2" onclick={handleLogout}>
				<LogOut class="h-4 w-4" />
				Log out
			</Button>
		</div>
	</header>

	{@render children()}

	<div class="fixed right-5 bottom-5">
		<ModeToggle />
	</div>
</div>
