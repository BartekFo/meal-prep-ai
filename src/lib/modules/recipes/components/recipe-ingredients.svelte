<script lang="ts">
	import { Minus, Plus } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	export let ingredients: string[];
	export let defaultServings: number;

	let servings = defaultServings;

	function increaseServings() {
		servings += 1;
	}

	function decreaseServings() {
		if (servings > 1) {
			servings -= 1;
		}
	}
</script>

<Card>
	<CardHeader class="pb-2">
		<div class="flex items-center justify-between">
			<CardTitle class="text-lg">Ingredients</CardTitle>
			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					size="icon"
					class="h-8 w-8"
					onclick={decreaseServings}
					disabled={servings <= 1}
				>
					<Minus class="h-4 w-4" />
					<span class="sr-only">Decrease servings</span>
				</Button>
				<span class="w-8 text-center">{servings}</span>
				<Button variant="outline" size="icon" class="h-8 w-8" onclick={increaseServings}>
					<Plus class="h-4 w-4" />
					<span class="sr-only">Increase servings</span>
				</Button>
			</div>
		</div>
	</CardHeader>
	<CardContent>
		<ul class="space-y-2">
			{#each ingredients as ingredient, index}
				<li class="flex items-start gap-2">
					<div class="bg-primary mt-2 h-2 w-2 rounded-full"></div>
					<span>{ingredient}</span>
				</li>
			{/each}
		</ul>
	</CardContent>
</Card>
