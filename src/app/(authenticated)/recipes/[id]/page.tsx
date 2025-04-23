import { ArrowLeft, Clock, Printer, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RecipeIngredients } from "./components/recipe-ingredients";
import { RecipeInstructions } from "./components/recipe-instructions";
import { RecipeNutrition } from "./components/recipe-nutrition";

// This would typically come from a database fetch
const getRecipe = (id: string) => {
  // Sample data - in a real app, you would fetch this from your database
  const recipes = [
    {
      id: "1",
      title: "Chicken Stir Fry",
      description:
        "A quick and healthy weeknight dinner option packed with vegetables and lean protein.",
      image: "/placeholder.svg?height=400&width=800",
      prepTime: "15 min",
      cookTime: "20 min",
      servings: 4,
      mealType: "dinner",
      calories: 450,
      protein: 35,
      carbs: 30,
      fat: 15,
      ingredients: [
        "1 lb boneless, skinless chicken breast, cut into bite-sized pieces",
        "2 tbsp vegetable oil",
        "1 red bell pepper, sliced",
        "1 yellow bell pepper, sliced",
        "1 cup broccoli florets",
        "1 cup snap peas",
        "2 carrots, julienned",
        "3 cloves garlic, minced",
        "1 tbsp ginger, minced",
        "¼ cup low-sodium soy sauce",
        "2 tbsp honey",
        "1 tbsp cornstarch",
        "¼ cup water",
        "2 green onions, sliced",
        "Sesame seeds for garnish",
      ],
      instructions: [
        "In a small bowl, whisk together soy sauce, honey, cornstarch, and water. Set aside.",
        "Heat 1 tablespoon of oil in a large wok or skillet over medium-high heat.",
        "Add chicken and cook until no longer pink, about 5-6 minutes. Remove from pan and set aside.",
        "Add remaining oil to the pan. Add bell peppers, broccoli, snap peas, and carrots. Stir-fry for 3-4 minutes until vegetables begin to soften.",
        "Add garlic and ginger, stir-fry for 30 seconds until fragrant.",
        "Return chicken to the pan. Pour sauce over the chicken and vegetables.",
        "Cook, stirring frequently, until sauce thickens and everything is well coated, about 2 minutes.",
        "Garnish with green onions and sesame seeds before serving.",
        "Serve hot over rice or noodles if desired.",
      ],
    },
    {
      id: "2",
      title: "Overnight Oats",
      description:
        "Prepare the night before for a quick breakfast that's packed with fiber and protein.",
      image: "/placeholder.svg?height=400&width=800",
      prepTime: "10 min",
      cookTime: "0 min",
      servings: 1,
      mealType: "breakfast",
      calories: 350,
      protein: 15,
      carbs: 55,
      fat: 8,
      ingredients: [
        "½ cup rolled oats",
        "½ cup milk of choice",
        "¼ cup Greek yogurt",
        "1 tbsp chia seeds",
        "1 tbsp honey or maple syrup",
        "½ tsp vanilla extract",
        "Pinch of salt",
        "Toppings: fresh berries, sliced banana, nuts, or nut butter",
      ],
      instructions: [
        "In a jar or container with a lid, combine oats, milk, yogurt, chia seeds, honey, vanilla extract, and salt.",
        "Stir well until all ingredients are combined.",
        "Seal the container and refrigerate overnight or for at least 4 hours.",
        "In the morning, stir the oats and add a splash of milk if they're too thick.",
        "Top with your favorite toppings and enjoy cold.",
      ],
    },
    // Add more recipes as needed
  ];

  return recipes.find((recipe) => recipe.id === id);
};

export default async function RecipePage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const recipe = getRecipe(id);

  if (!recipe) {
    return <div className="p-6">Recipe not found</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-6">
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
