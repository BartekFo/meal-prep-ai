import { createClient } from "@/lib/supabase/server";
import { RecipeCard } from "./recipe-card";

export async function RecipeList() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("recipes").select("*");

  if (error) {
    throw new Error(`Error fetching recipes: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-10 text-center">
        No recipes found. Add some recipes to get started!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
