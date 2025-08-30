<script lang="ts">
import { goto } from '$app/navigation';
import { authClient } from '$lib/auth/auth-client';
import Button from '$lib/components/ui/button/button.svelte';
import { Input } from '$lib/components/ui/input/index';
import { Label } from '$lib/components/ui/label/index';
import { cn } from '$lib/utils';
import FormCard from '../../components/form-card.svelte';

let {
  class: className = '',
  ...restProps
}: { class?: string; [key: string]: unknown } = $props();

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
      password,
    });

    if (result.error) {
      error = result.error.message || 'Login failed';
    } else {
      const { data } = await authClient.getSession();
      const onboardingStatus = data?.user?.onboardingStatus;

      if (!onboardingStatus || onboardingStatus === 'not_started') {
        goto('/onboarding');
      } else if (onboardingStatus === 'step1_completed') {
        goto('/onboarding/preferences');
      } else {
        goto('/dashboard');
      }
    }
  } catch (err) {
    error = 'An unexpected error occurred';
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
						<div class="flex items-center">
							<Label for="password">Password</Label>
						</div>
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
						{isLoading ? 'Signing in...' : 'Login'}
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
					Don't have an account?{' '}
					<a href="/sign-up" class="underline underline-offset-4"> Sign up </a>
				</div>
			</div>
		</div>
	{/snippet}
</FormCard>
