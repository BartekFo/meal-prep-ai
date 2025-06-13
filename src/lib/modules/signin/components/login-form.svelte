<script lang="ts">
	import { authClient } from '$lib/auth/auth-client';
	import { cn } from '$lib/utils';
	import { goto } from '$app/navigation';
	import FormCard from '$lib/components/form-card.svelte';

	let { class: className = '', ...restProps }: { class?: string; [key: string]: any } = $props();

	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let error = $state('');

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isLoading = true;
		error = '';

		try {
			const result = await authClient.signIn.email({
				email,
				password
			});

			if (result.error) {
				error = result.error.message || 'Login failed';
			} else {
				goto('/dashboard');
			}
		} catch (err) {
			error = 'An unexpected error occurred';
			console.error('Login error:', err);
		} finally {
			isLoading = false;
		}
	}
</script>

<FormCard title="Login" description="Sign in to access your recipes and meal plans">
	{#snippet children()}
		<div class="p-6">
			<form onsubmit={handleSubmit} class={cn('flex flex-col gap-6', className)} {...restProps}>
				<div class="grid gap-6">
					{#if error}
						<div class="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
							{error}
						</div>
					{/if}

					<div class="grid gap-3">
						<label
							for="email"
							class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Email
						</label>
						<input
							id="email"
							bind:value={email}
							type="email"
							placeholder="m@example.com"
							required
							disabled={isLoading}
							class="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>

					<div class="grid gap-3">
						<div class="flex items-center">
							<label
								for="password"
								class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Password
							</label>
							<a href="/forgot-password" class="ml-auto text-sm underline-offset-4 hover:underline">
								Forgot your password?
							</a>
						</div>
						<input
							id="password"
							bind:value={password}
							type="password"
							required
							disabled={isLoading}
							class="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-9 w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
					>
						{#if isLoading}
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
							></div>
						{/if}
						{isLoading ? 'Signing in...' : 'Login'}
					</button>
				</div>
			</form>

			<div class="mt-6 flex flex-col space-y-4">
				<div class="relative flex w-full items-center">
					<div class="flex-grow border-t border-gray-300"></div>
					<span class="mx-4 text-sm text-gray-500">or</span>
					<div class="flex-grow border-t border-gray-300"></div>
				</div>
				<div class="text-center text-sm">
					Don't have an account?{' '}
					<a href="/sign-up" class="underline underline-offset-4"> Sign up </a>
				</div>
			</div>
		</div>
	{/snippet}
</FormCard>
