<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import NutritionItem from './nutrition-item.svelte';

	interface NutritionProps {
		calories: number;
		protein: number;
		carbs: number;
		fat: number;
	}

	let { calories, protein, carbs, fat }: NutritionProps = $props();
</script>

<Card>
	<CardHeader class="pb-2">
		<CardTitle class="text-lg">Nutrition Information</CardTitle>
		<CardDescription>Per serving</CardDescription>
	</CardHeader>
	<CardContent>
		<div class="grid grid-cols-4 gap-4 text-center">
			<NutritionItem value={calories} label="Calories" />
			<NutritionItem value={protein} label="Protein" unit="g" />
			<NutritionItem value={carbs} label="Carbs" unit="g" />
			<NutritionItem value={fat} label="Fat" unit="g" />
		</div>
	</CardContent>
</Card>
