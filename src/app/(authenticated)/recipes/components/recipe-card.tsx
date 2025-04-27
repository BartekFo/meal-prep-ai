"use client";

import { Clock, CookingPot } from "lucide-react";
import Image from "next/image";

import { Text } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Tables } from "@/lib/supabase/database.types";
import Link from "next/link";

interface RecipeCardProps {
  recipe: Tables<"recipes">;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = `${recipe.prep_time} prep · ${recipe.cook_time} cook`;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-video">
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <CookingPot className="h-12 w-12" />
            <Text>No image provided</Text>
          </div>
        )}
        <Badge className="absolute top-2 right-2 capitalize">
          {recipe.meal_type}
        </Badge>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1">{recipe.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {recipe.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center text-muted-foreground text-sm">
          <Clock className="mr-1 h-4 w-4" />
          <span>{totalTime}</span>
        </div>
        <div className="mt-4 flex justify-between">
          <div className="text-center">
            <div className="font-medium text-sm">{recipe.calories}</div>
            <div className="text-muted-foreground text-xs">Calories</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-sm">{recipe.protein}g</div>
            <div className="text-muted-foreground text-xs">Protein</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-sm">{recipe.carbs}g</div>
            <div className="text-muted-foreground text-xs">Carbs</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-sm">{recipe.fat}g</div>
            <div className="text-muted-foreground text-xs">Fat</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/recipes/${recipe.id}`}>View Recipe</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
