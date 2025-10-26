<script lang="ts">
  import type { Snippet } from "svelte";
  import { Card, CardContent } from "$lib/components/ui/card";

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
</script>

<Card>
	<CardContent class="flex flex-col gap-5">
		{@render children()}
	</CardContent>
</Card>
