"use client";

import { Clock } from "lucide-react";
import Image from "next/image";

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
import Link from "next/link";

interface Recipe {
	id: string;
	title: string;
	description: string;
	image: string;
	prepTime: string;
	cookTime: string;
	mealType: string;
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
}

interface RecipeCardProps {
	recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
	const totalTime = `${recipe.prepTime} prep · ${recipe.cookTime} cook`;

	return (
		<Card className="overflow-hidden transition-all hover:shadow-md">
			<div className="relative aspect-video">
				<Image
					src={recipe.image || "/placeholder.svg"}
					alt={recipe.title}
					fill
					className="object-cover"
				/>
				<Badge className="absolute top-2 right-2 capitalize">
					{recipe.mealType}
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
