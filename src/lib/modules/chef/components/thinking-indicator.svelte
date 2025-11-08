<script lang="ts">
	import { Loader2 } from '@lucide/svelte';
	import { Avatar, AvatarFallback } from '$lib/components/ui/avatar';
	import { Card } from '$lib/components/ui/card';
</script>

<div class="flex gap-3 justify-start">
	<Avatar class="size-8 shrink-0">
		<AvatarFallback class="bg-primary/10 text-primary">
			<Loader2 class="size-4 animate-spin" />
		</AvatarFallback>
	</Avatar>

	<div class="flex max-w-[80%] flex-col gap-1">
		<Card class="p-4 bg-card">
			<div class="flex items-center gap-2">
				<span class="text-sm text-muted-foreground">Just one second...</span>
				<div class="flex gap-1">
					<span class="dot"></span>
					<span class="dot animation-delay-200"></span>
					<span class="dot animation-delay-400"></span>
				</div>
			</div>
		</Card>
	</div>
</div>

<style>
	.dot {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: hsl(var(--primary));
		animation: bounce 1.4s infinite ease-in-out both;
	}

	.animation-delay-200 {
		animation-delay: 0.2s;
	}

	.animation-delay-400 {
		animation-delay: 0.4s;
	}

	@keyframes bounce {
		0%,
		80%,
		100% {
			transform: scale(0);
			opacity: 0.5;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
