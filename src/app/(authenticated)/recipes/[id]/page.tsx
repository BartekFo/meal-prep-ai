import { ArrowLeft, Clock, Printer, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { RecipeIngredients } from "./components/recipe-ingredients";
import { RecipeInstructions } from "./components/recipe-instructions";
import { RecipeNutrition } from "./components/recipe-nutrition";

async function getRecipe(id: string) {
  const supabase = await createClient();

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !recipe) {
    return null;
  }

  return {
    id: recipe.id.toString(),
    title: recipe.title,
    description: recipe.description,
    image: recipe.image_url || "/placeholder.svg?height=400&width=800",
    prepTime: `${recipe.prep_time} min`,
    cookTime: `${recipe.cook_time} min`,
    servings: recipe.servings || 4,
    mealType: recipe.meal_type,
    calories: recipe.calories || 0,
    protein: recipe.protein || 0,
    carbs: recipe.carbs || 0,
    fat: recipe.fat || 0,
    ingredients: recipe.ingredients as string[],
    instructions: recipe.instructions as string[],
  };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/recipes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={recipe.image || "/placeholder.svg"}
          alt={recipe.title}
          fill
          className="object-cover"
          priority
        />
        <Badge className="absolute top-4 right-4 capitalize">
          {recipe.mealType}
        </Badge>
      </div>

      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">{recipe.title}</h1>
        <p className="text-lg text-muted-foreground">{recipe.description}</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4 text-center">
          <div className="mb-1 flex items-center justify-center">
            <Clock className="mr-1 h-4 w-4" />
            <span className="font-medium text-sm">Prep Time</span>
          </div>
          <p className="font-semibold text-lg">{recipe.prepTime}</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="mb-1 flex items-center justify-center">
            <Clock className="mr-1 h-4 w-4" />
            <span className="font-medium text-sm">Cook Time</span>
          </div>
          <p className="font-semibold text-lg">{recipe.cookTime}</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="mb-1 flex items-center justify-center">
            <span className="font-medium text-sm">Total Time</span>
          </div>
          <p className="font-semibold text-lg">
            {recipe.cookTime === "0 min"
              ? recipe.prepTime
              : `${Number.parseInt(recipe.prepTime) + Number.parseInt(recipe.cookTime)} min`}
          </p>
        </Card>
        <Card className="p-4 text-center">
          <div className="mb-1 flex items-center justify-center">
            <span className="font-medium text-sm">Servings</span>
          </div>
          <p className="font-semibold text-lg">{recipe.servings}</p>
        </Card>
      </div>

      <RecipeNutrition
        calories={recipe.calories}
        protein={recipe.protein}
        carbs={recipe.carbs}
        fat={recipe.fat}
      />

      <Separator className="my-8" />

      <div className="grid gap-8 md:grid-cols-2">
        <RecipeIngredients
          ingredients={recipe.ingredients}
          servings={recipe.servings}
        />
        <RecipeInstructions instructions={recipe.instructions} />
      </div>
    </div>
  );
}
