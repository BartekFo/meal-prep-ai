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

    if (!imageFile) throw new Error("No image file provided");

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${userId}/${title}.${fileExt}`;

    const { error } = await supabase.storage
      .from("recipes-images")
      .upload(fileName, imageFile, {
        upsert: true,
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }
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
    console.log("imageFile", imageFile);

    const validatedData = await serverValidate(formData);

    const supabase = await createClient();
    const user = await supabase.auth.getUser();

    const userId = user.data.user?.id;

    if (!userId) throw new Error("User not authenticated");

    if (!isMealType(validatedData.mealType)) {
      throw new Error("Invalid meal type");
    }

    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImageToSupabase({
        imageFile,
        title: validatedData.title,
        userId,
      });
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
