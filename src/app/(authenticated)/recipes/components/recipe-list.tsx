import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { mapRecipeFromDTO } from "../utils/dto";
import { RecipeCard } from "./recipe-card";

const getRecipes = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("recipes").select("*");

  if (error) {
    throw new Error(`Error fetching recipes: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  return data.map(mapRecipeFromDTO);
});

export async function RecipeList() {
  const recipes = await getRecipes();

  if (recipes.length === 0) {
    return (
      <div className="py-10 text-center">
        No recipes found. Add some recipes to get started!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
