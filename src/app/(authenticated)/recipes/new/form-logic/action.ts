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
import { formOpts } from "./shared-code";

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    // const result = safeParse(recipeFormSchema, value);
    // if (result.issues && result.issues.length > 0) {
    //   console.log(result.issues);
    //   return result.issues;
    // }
  },
});

function isMealType(value: string): value is TMealType {
  return MEAL_TYPES.includes(value as TMealType);
}

interface IUploadImageToSupabaseArgs {
  imageFile: File | undefined;
  title: string;
  userId: string;
}

async function uploadImageToSupabase({
  imageFile,
  userId,
  title,
}: IUploadImageToSupabaseArgs) {
  try {
    const supabase = await createClient();

    if (!imageFile) return null;

    const fileName = `${userId}/${imageFile.name}`;

    const { error, data } = await supabase.storage
      .from("recipes-images")
      .upload(fileName, imageFile, {
        upsert: true,
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    return data.path;
  } catch (error) {
    console.error("Error in uploadImageToSupabase:", error);
    return null;
  }
}

export default async function addRecipeAction(
  prev: unknown,
  formData: FormData,
) {
  try {
    const imageFile = formData.get("image") as File;

    const validatedData = await serverValidate(formData);

    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    const userId = user.data.user?.id;

    if (!userId) throw new Error("User not authenticated");

    if (!isMealType(validatedData.mealType)) {
      throw new Error("Invalid meal type");
    }

    const imageUrl = await uploadImageToSupabase({
      imageFile,
      title: validatedData.title,
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
