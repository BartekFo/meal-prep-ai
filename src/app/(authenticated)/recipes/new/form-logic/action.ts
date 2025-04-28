"use server";

import { createClient } from "@/lib/supabase/server";
import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { safeParse } from "valibot";
import { recipeFormSchema } from "../schema";
import { convertObjectToArray, isMealType } from "./helpers";
import { uploadImageToSupabase } from "./image-upload";
import { formOpts } from "./shared-form-code";

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    // Ensure ingredients and instructions are proper arrays
    if (
      value.ingredients &&
      typeof value.ingredients === "object" &&
      !Array.isArray(value.ingredients)
    ) {
      value.ingredients = convertObjectToArray<string>(
        value.ingredients as Record<string, string>,
      );
    }

    if (
      value.instructions &&
      typeof value.instructions === "object" &&
      !Array.isArray(value.instructions)
    ) {
      value.instructions = convertObjectToArray<string>(
        value.instructions as Record<string, string>,
      );
    }

    const result = safeParse(recipeFormSchema, value);
    if (result.issues && result.issues.length > 0) {
      return result.issues;
    }
  },
});

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

    const imageUrl = await uploadImageToSupabase({
      imageFile: validatedData.image,
      userId,
    });

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
        image_url: imageUrl,
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
