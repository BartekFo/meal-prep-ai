<script lang="ts">
import { goto } from '$app/navigation';
import { authClient } from '$lib/auth/auth-client';
import Button from '$lib/components/ui/button/button.svelte';
import { Input } from '$lib/components/ui/input/index';
import { Label } from '$lib/components/ui/label/index';
import { cn } from '$lib/utils';
import FormCard from '../../components/form-card.svelte';

const {
  class: className = '',
  ...restProps
}: { class?: string; [key: string]: unknown } = $props();

let email = $state('');
let name = $state('');
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
      name,
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
						<Label for="email">Email</Label>
						<Input
							id="email"
							bind:value={email}
							type="email"
							placeholder="m@example.com"
							required
							disabled={isLoading}
						/>
					</div>

					<div class="grid gap-3">
						<Label for="email">Name</Label>
						<Input
							id="name"
							bind:value={name}
							type="text"
							placeholder="John Doe"
							required
							disabled={isLoading}
						/>
					</div>

					<div class="grid gap-3">
						<Label for="password">Password</Label>
						<Input
							id="password"
							bind:value={password}
							type="password"
							required
							disabled={isLoading}
						/>
					</div>

					<Button type="submit" disabled={isLoading}>
						{#if isLoading}
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
							></div>
						{/if}
						{isLoading ? 'Creating account...' : 'Sign up'}
					</Button>
				</div>
			</form>

			<div class="mt-6 flex flex-col space-y-4">
				<div class="relative flex w-full items-center">
					<div class="flex-grow border-t border-gray-300"></div>
					<span class="mx-4 text-sm text-gray-500">or</span>
					<div class="flex-grow border-t border-gray-300"></div>
				</div>
				<div class="text-center text-sm">
					Already have an account?{' '}
					<a href="/login" class="underline underline-offset-4"> Login </a>
				</div>
			</div>
		</div>
	{/snippet}
</FormCard>
