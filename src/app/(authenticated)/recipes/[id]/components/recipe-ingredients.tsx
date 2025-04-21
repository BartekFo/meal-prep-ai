"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecipeIngredientsProps {
  ingredients: string[];
  servings: number;
}

export function RecipeIngredients({
  ingredients,
  servings: defaultServings,
}: RecipeIngredientsProps) {
  const [servings, setServings] = useState(defaultServings);

  const increaseServings = () => {
    setServings((prev) => prev + 1);
  };

  const decreaseServings = () => {
    if (servings > 1) {
      setServings((prev) => prev - 1);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Ingredients</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={decreaseServings}
              disabled={servings <= 1}
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Decrease servings</span>
            </Button>
            <span className="w-8 text-center">{servings}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={increaseServings}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Increase servings</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <li key={index} className="flex items-start gap-2">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <span>{ingredient}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
