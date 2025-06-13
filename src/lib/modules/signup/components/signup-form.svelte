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
			const result = await authClient.signUp.email({
				email,
				password,
				name: email.split('@')[0] // Use email prefix as default name
			});

			if (result.error) {
				error = result.error.message || 'Sign up failed';
			} else {
				goto('/dashboard');
			}
		} catch (err) {
			error = 'An unexpected error occurred';
			console.error('Signup error:', err);
		} finally {
			isLoading = false;
		}
	}
</script>

<FormCard title="Create an account" description="Enter your email below to create an account">
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
						<label
							for="password"
							class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Password
						</label>
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
						{isLoading ? 'Creating account...' : 'Sign up'}
					</button>
				</div>
			</form>

			<div class="mt-6 flex flex-col space-y-4">
				<div class="relative flex w-full items-center">
					<div class="flex-grow border-t border-gray-300" />
					<span class="mx-4 text-sm text-gray-500">or</span>
					<div class="flex-grow border-t border-gray-300" />
				</div>
				<div class="text-center text-sm">
					Already have an account?{' '}
					<a href="/login" class="underline underline-offset-4"> Login </a>
				</div>
			</div>
		</div>
	{/snippet}
</FormCard>
