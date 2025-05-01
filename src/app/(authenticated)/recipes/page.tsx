import { Plus } from "lucide-react";
import { Suspense } from "react";

import { Header } from "@/components/header";
import { Heading1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { getPathnameFromHeaders } from "@/lib/utils/getPathnameFromHeaders";
import Link from "next/link";
import { RecipeFilters } from "./components/recipe-filters";
import { RecipeList } from "./components/recipe-list";
import { RecipeListSkeleton } from "./components/recipe-list-skeleton";

export default async function RecipesPage() {
  const pathname = await getPathnameFromHeaders();
  return (
    <>
      <Header pathname={pathname} />
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <Heading1 className="font-semibold text-2xl">Recipes</Heading1>
          <Button asChild>
            <Link href="/recipes/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Recipe
            </Link>
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <RecipeFilters />
          <Suspense fallback={<RecipeListSkeleton />}>
            <RecipeList />
          </Suspense>
        </div>
      </div>
    </>
  );
}
