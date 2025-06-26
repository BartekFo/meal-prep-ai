<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { routes } from '$lib/constants/routes';
	import { NotebookPen, Handshake, BotMessageSquare } from '@lucide/svelte';
</script>

<main class="flex-1 px-4 py-8">
	<div class="mx-auto max-w-2xl">
		<div class="bg-background rounded-lg border p-6 shadow-sm">
			<div class="space-y-6">
				<div class="grid place-items-center">
					<NotebookPen class="mx-auto mb-4 h-12 w-12" />
					<div class="prose text-center">
						<h1>Welcome!</h1>
						<p class="text-muted-foreground">
							Let's start by setting up your meal planning preferences.
						</p>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<Button
						href={routes.onboarding.ai}
						class="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex h-auto flex-col items-center justify-between rounded-md border-2 bg-transparent p-4 whitespace-normal"
					>
						<BotMessageSquare />
						AI
						<span class="text-muted-foreground text-center text-sm">
							Talk to our recipe assistant that will help you onboard.
						</span>
					</Button>
					<Button
						href="/onboarding/manual"
						class="border-muted hover:bg-accent hover:text-accent-foreground flex h-auto flex-col items-center justify-between rounded-md border-2 bg-transparent p-4 whitespace-normal"
					>
						<Handshake class="mb-2 h-8 w-8" />
						<span class="font-medium">Manual Setup</span>
						<span class="text-muted-foreground text-center text-sm">
							Manually add your dietary preferences and personal information.
						</span>
					</Button>
				</div>
			</div>
		</div>
	</div>
</main>
