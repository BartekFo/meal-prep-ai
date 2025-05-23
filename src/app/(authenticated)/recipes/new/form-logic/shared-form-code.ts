import { formOptions } from "@tanstack/react-form/nextjs";
import { type IRecipeFormValues, recipeFormSchema } from "../schema";

const defatultRecipeFormValues: IRecipeFormValues = {
  title: "",
  description: "",
  prepTime: "",
  cookTime: "",
  servings: "4",
  mealType: "breakfast",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  ingredients: [""],
  instructions: [""],
};

export const recipeFormOpts = formOptions({
  defaultValues: defatultRecipeFormValues,
  validators: {
    onSubmit: recipeFormSchema,
  },
});
