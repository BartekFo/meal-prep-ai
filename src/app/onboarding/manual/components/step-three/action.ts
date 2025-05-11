"use server";

import { routes } from "@/lib/constants/routes";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function saveFoodPreferencesAction(dislikedIngredients: string[]) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    data: {
      disliked_ingredients: dislikedIngredients,
    },
  });

  if (error) {
    console.error(error);
    return;
  }

  redirect(routes.dashboard);
}
