"use server";

import { MEAL_TYPES } from "@/lib/constants/meal-types";
import { createClient } from "@/lib/supabase/server";
import type { TMealType } from "@/lib/types";
import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { safeParse } from "valibot";
import { recipeFormSchema } from "../schema";
import { formOpts } from "./shared-code";

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    console.log("value.ingredients", value.ingredients);
    console.log("value.instructions", value.instructions);
    const result = safeParse(recipeFormSchema, value);

    if (result.issues && result.issues.length > 0) {
      console.log(result.issues);
      return result.issues;
    }
  },
});

function isMealType(value: string): value is TMealType {
  return MEAL_TYPES.includes(value as TMealType);
}

export default async function addRecipeAction(
  prev: unknown,
  formData: FormData,
) {
  try {
    const validatedData = await serverValidate(formData);

    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    const userId = user.data.user?.id;

    if (!userId) throw new Error("User not authenticated");

    if (!isMealType(validatedData.mealType)) {
      throw new Error("Invalid meal type");
    }

    const { error } = await supabase.from("recipes").insert([
      {
        user_id: userId,
        title: validatedData.title,
        description: validatedData.description || "",
        prep_time: Number(validatedData.prepTime),
        cook_time: Number(validatedData.cookTime),
        servings: Number(validatedData.servings),
        meal_type: validatedData.mealType,
        ingredients: JSON.stringify(validatedData.ingredients),
        instructions: JSON.stringify(validatedData.instructions),
      },
    ]);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/recipes");
    redirect("/recipes");
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    throw e;
  }
}
