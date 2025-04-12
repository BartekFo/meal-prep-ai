"use server";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
	const supabase = await createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	console.log(data);

	const { error } = await supabase.auth.signUp(data);

	console.log(error);

	if (error) {
		redirect("/error");
	}

	revalidatePath("/", "layout");
	redirect("/");
}
