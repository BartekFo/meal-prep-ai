<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { scaleIngredient } from "../utils/scaling.js";

  export let ingredients: string[];
  export let multiplier: number;
</script>

<Card>
	<CardHeader class="pb-2">
		<CardTitle class="text-lg">Ingredients</CardTitle>
	</CardHeader>
	<CardContent>
		<ul class="space-y-2">
			{#each ingredients as ingredient, index}
				<li class="flex items-start gap-2">
					<div class="bg-primary mt-2 h-2 w-2 rounded-full"></div>
					<span>{scaleIngredient(ingredient, multiplier)}</span>
				</li>
			{/each}
		</ul>
	</CardContent>
</Card>
