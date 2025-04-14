import { Plus } from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { RecipeFilters } from "./components/recipe-filters";
import { RecipeList } from "./components/recipe-list";
import { RecipeListSkeleton } from "./components/recipe-list-skeleton";

export default function RecipesPage() {
	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center justify-between border-b px-6 py-4">
				<h1 className="font-semibold text-2xl">Recipes</h1>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Add Recipe
				</Button>
			</div>
			<div className="flex-1 overflow-auto p-6">
				<RecipeFilters />
				<Suspense fallback={<RecipeListSkeleton />}>
					<RecipeList />
				</Suspense>
			</div>
		</div>
	);
}
