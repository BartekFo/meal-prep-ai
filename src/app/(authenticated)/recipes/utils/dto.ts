import type { Tables } from "@/lib/supabase/database.types";
import type { Recipe } from "../types";

export function mapRecipeFromDTO(recipe: Tables<"recipes">): Recipe {
  return {
    ...recipe,
    id: recipe.id.toString(),
    mealType: recipe.meal_type,
    prepTime: recipe.prep_time.toString(),
    cookTime: recipe.cook_time.toString(),
    imageUrl: recipe.image_url,
  };
}
