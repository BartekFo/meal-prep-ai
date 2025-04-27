import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Heading1 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { AddRecipeForm } from "./components/add-recipe-form";

export default function AddRecipePage() {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/recipes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <Heading1 className="font-bold text-3xl">Add New Recipe</Heading1>
        <p className="text-muted-foreground">
          Fill out the form below to add a new recipe to your collection.
        </p>
      </div>

      <AddRecipeForm />
    </div>
  );
}
