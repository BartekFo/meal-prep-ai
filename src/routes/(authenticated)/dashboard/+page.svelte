<script lang="ts">
import { authClient } from '$lib/auth/auth-client';

const session = authClient.useSession();
</script>

<svelte:head>
	<title>Dashboard - Meal Prep AI</title>
</svelte:head>

<div class="container mx-auto p-6">
	<div class="mb-8">
		<h1 class="text-foreground text-3xl font-bold">Welcome to Meal Prep AI</h1>
		{#if $session.data?.user}
			<p class="text-muted-foreground mt-2">
				Hello, {$session.data.user.name || $session.data.user.email}!
			</p>
		{/if}
	</div>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		<div class="bg-card rounded-lg border p-6 shadow-sm">
			<h3 class="text-card-foreground text-lg font-semibold">My Recipes</h3>
			<p class="text-muted-foreground mt-2">Manage and organize your favorite recipes</p>
			<a
				href="/recipes"
				class="text-primary mt-4 inline-flex items-center text-sm font-medium hover:underline"
			>
				View all recipes →
			</a>
		</div>

		<div class="bg-card rounded-lg border p-6 shadow-sm">
			<h3 class="text-card-foreground text-lg font-semibold">Meal Plans</h3>
			<p class="text-muted-foreground mt-2">Plan your meals for the week ahead</p>
			<a
				href="/meal-plans"
				class="text-primary mt-4 inline-flex items-center text-sm font-medium hover:underline"
			>
				Create meal plan →
			</a>
		</div>

		<div class="bg-card rounded-lg border p-6 shadow-sm">
			<h3 class="text-card-foreground text-lg font-semibold">Shopping Lists</h3>
			<p class="text-muted-foreground mt-2">Generate smart shopping lists from your meal plans</p>
			<a
				href="/shopping"
				class="text-primary mt-4 inline-flex items-center text-sm font-medium hover:underline"
			>
				View lists →
			</a>
		</div>
	</div>

	<div class="mt-8">
		<button
			on:click={async () => {
				await authClient.signOut();
				window.location.href = '/login';
			}}
			class="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors"
		>
			Sign Out
		</button>
	</div>
</div>
