import { formOptions } from "@tanstack/react-form/nextjs";
import { type IRecipeFormValues, recipeFormSchema } from "../schema";

const defatultRecipeFormValues: IRecipeFormValues = {
  title: "",
  description: "",
  prepTime: "",
  cookTime: "",
  servings: "4",
  mealType: "",
  ingredients: [""],
  instructions: [""],
};

export const formOpts = formOptions({
  defaultValues: defatultRecipeFormValues,
  validators: {
    onSubmit: recipeFormSchema,
  },
});
