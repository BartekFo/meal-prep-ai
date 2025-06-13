<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		title,
		description,
		children,
		class: className = ''
	}: {
		title: string;
		description: string;
		children: any;
		class?: string;
	} = $props();
</script>

<div class={cn('bg-card text-card-foreground w-full rounded-lg border shadow-xl', className)}>
	<div class="flex flex-col items-center space-y-1 p-6">
		<div class="bg-foreground mb-2 flex h-12 w-12 items-center justify-center rounded-full">
			<!-- UtensilsCrossed icon -->
			<svg
				class="text-primary h-6 w-6"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
				<path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
				<path d="m2.1 21.9 6.4-6.4" />
			</svg>
		</div>
		<h1 class="text-center text-2xl font-bold">{title}</h1>
		<p class="text-muted-foreground text-center">{description}</p>
	</div>
	{@render children()}
</div>
