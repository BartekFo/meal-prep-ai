<script lang="ts">
  import { UtensilsCrossed } from "@lucide/svelte";
  import type { Snippet } from "svelte";
  import { cn } from "$lib/utils";

  const {
    title,
    description,
    children,
    class: className = "",
  }: {
    title: string;
    description: string;
    children: Snippet;
    class?: string;
  } = $props();
</script>

<div class={cn('bg-card text-card-foreground prose w-full rounded-lg border shadow-xl', className)}>
	<div class="flex flex-col items-center p-6 pb-0">
		<div
			class="bg-foreground text-primary mb-2 flex h-12 w-12 items-center justify-center rounded-full"
		>
			<UtensilsCrossed class="h-6 w-6" />
		</div>
		<h3>{title}</h3>
		<p class="text-muted-foreground text-center">{description}</p>
	</div>
	{@render children()}
</div>
