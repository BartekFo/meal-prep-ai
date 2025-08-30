<script lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '$lib/components/ui/card';
import NutritionItem from './nutrition-item.svelte';

type NutritionProps = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  multiplier: number;
};

const { calories, protein, carbs, fat, multiplier }: NutritionProps = $props();

// Calculate scaled nutrition values
const scaledCalories = Math.round(calories * multiplier);
const scaledProtein = Math.round(protein * multiplier * 10) / 10;
const scaledCarbs = Math.round(carbs * multiplier * 10) / 10;
const scaledFat = Math.round(fat * multiplier * 10) / 10;
</script>

<Card>
	<CardHeader class="pb-2">
		<CardTitle class="text-lg">Nutrition Information</CardTitle>
		<CardDescription>Per serving</CardDescription>
	</CardHeader>
	<CardContent>
		<div class="grid grid-cols-4 gap-4 text-center">
			<NutritionItem value={scaledCalories} label="Calories" />
			<NutritionItem value={scaledProtein} label="Protein" unit="g" />
			<NutritionItem value={scaledCarbs} label="Carbs" unit="g" />
			<NutritionItem value={scaledFat} label="Fat" unit="g" />
		</div>
	</CardContent>
</Card>
