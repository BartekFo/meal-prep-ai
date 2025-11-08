<script lang="ts">
	import { AlertCircle, ArrowLeft, Home } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { routes } from '$lib/constants/routes';

	const status = $derived(page.status);
	const message = $derived(page.error?.message ?? 'An error occurred');

	const is404 = $derived(status === 404);
	const title = $derived(is404 ? 'Page Not Found' : 'Something Went Wrong');
	const description = $derived(
		is404 ? "The page you're looking for doesn't exist or has been moved." : message
	);

	function handleGoBack() {
		if (typeof window !== 'undefined' && window.history.length > 1) {
			window.history.back();
		} else {
			goto(routes.dashboard);
		}
	}
</script>

<svelte:head>
	<title>{status} - {title}</title>
</svelte:head>

<div class="bg-background flex min-h-screen items-center justify-center p-4">
	<div class="w-full max-w-md space-y-8">
		<div class="bg-card flex flex-col items-center gap-6 rounded-xl border p-8 shadow-sm">
			<!-- Icon -->
			<div class="bg-destructive/15 flex size-16 items-center justify-center rounded-full">
				<AlertCircle class="text-destructive size-8" />
			</div>

			<!-- Status Code -->
			<div class="text-center">
				<h1 class="text-primary text-6xl font-bold">{status}</h1>
			</div>

			<!-- Title and Description -->
			<div class="space-y-2 text-center">
				<h2 class="text-foreground text-2xl font-semibold">{title}</h2>
				<p class="text-muted-foreground text-sm">{description}</p>
			</div>

			<!-- Actions -->
			<div class="flex w-full flex-col gap-3 sm:flex-row">
				<Button href={routes.dashboard} class="flex-1">
					<Home class="size-4" />
					Go Home
				</Button>
				<Button variant="outline" onclick={handleGoBack} class="flex-1">
					<ArrowLeft class="size-4" />
					Go Back
				</Button>
			</div>
		</div>

		<!-- Additional Help Text -->
		{#if is404}
			<p class="text-muted-foreground text-center text-sm">
				Looking for something? Try starting from the
				<a href={routes.dashboard} class="text-primary hover:underline">dashboard</a>
				or check out your
				<a href={routes.recipes.base} class="text-primary hover:underline">recipes</a>.
			</p>
		{/if}
	</div>
</div>
