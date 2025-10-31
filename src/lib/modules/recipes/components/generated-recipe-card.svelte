<script lang="ts">
  import {
    CircleCheckBig,
    CircleX,
    Clock,
    LoaderCircle,
    Users,
  } from "@lucide/svelte";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import type { GeneratedRecipeCardProps } from "../chat/types";
  import RecipeIngredients from "./recipe-ingredients.svelte";
  import RecipeInstructions from "./recipe-instructions.svelte";
  import RecipeNutrition from "./recipe-nutrition.svelte";
  import RecipeStatCard from "./recipe-stat-card.svelte";

  type Props = GeneratedRecipeCardProps;

  let { recipe, toolCallId, toolState, onAddRecipe }: Props = $props();

  let isLoading = $state(false);
  let isSuccess = $state(false);
  let error = $state<string | null>(null);

  const totalTime = $derived(
    `${recipe.prepTime} min prep · ${recipe.cookTime} min cook`
  );

  async function handleAddRecipe() {
    if (!onAddRecipe) {
      return;
    }

    isLoading = true;
    error = null;
    isSuccess = false;

    try {
      await onAddRecipe(toolCallId, recipe);
      isSuccess = true;
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to add recipe";
    } finally {
      isLoading = false;
    }
  }
</script>

<Card class="gap-0 overflow-hidden">
  <CardHeader class="pb-4">
    <div class="mb-2 flex items-start justify-between gap-2">
      <CardTitle class="text-2xl">{recipe.title}</CardTitle>
      <Badge class="shrink-0 capitalize">{recipe.mealType}</Badge>
    </div>
    {#if recipe.description}
      <CardDescription class="text-base">{recipe.description}</CardDescription>
    {/if}
  </CardHeader>

  <CardContent class="space-y-6">
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <RecipeStatCard
        icon={Clock}
        label="Total Time"
        value={totalTime}
        unit=" min"
      />
      <RecipeStatCard
        icon={Users}
        label="Servings"
        value={recipe.servings}
      />
      <RecipeStatCard
        icon={Clock}
        label="Prep Time"
        value={recipe.prepTime}
        unit=" min"
      />
    </div>

    <RecipeIngredients ingredients={recipe.ingredients} multiplier={1} />

    <RecipeInstructions instructions={recipe.instructions} />

    <RecipeNutrition
      calories={recipe.calories}
      protein={recipe.protein}
      carbs={recipe.carbs}
      fat={recipe.fat}
      multiplier={1}
    />
  </CardContent>

  {#if toolState === "output-available"}
    <CardFooter class="flex flex-col gap-2 pt-4">
      {#if error}
        <div
          class="flex w-full items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
        >
          <CircleX class="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      {/if}

      {#if isSuccess}
        <div
          class="flex w-full items-center gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400"
        >
          <CircleCheckBig class="h-4 w-4 shrink-0" />
          <span>Recipe added successfully!</span>
        </div>
      {:else}
        <Button
          class="w-full"
          disabled={isLoading}
          onclick={handleAddRecipe}
          type="button"
        >
          {#if isLoading}
            <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
            Adding...
          {:else}
            Add to My Recipes
          {/if}
        </Button>
      {/if}
    </CardFooter>
  {/if}
</Card>
