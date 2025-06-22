<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	export let instructions: string[];
</script>

<Card>
	<CardHeader class="pb-2">
		<CardTitle class="text-lg">Instructions</CardTitle>
	</CardHeader>
	<CardContent>
		<ol class="space-y-4">
			{#each instructions as instruction, index}
				<li class="flex gap-3">
					<div
						class="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-medium"
					>
						{index + 1}
					</div>
					<p class="pt-0.5">{instruction}</p>
				</li>
			{/each}
		</ol>
	</CardContent>
</Card>
