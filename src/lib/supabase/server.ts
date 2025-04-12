import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/env";

import type { Database } from "./database.types";

export const createClient = async (
	supabaseKey: string = env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
) => {
	const cookieStore = await cookies();

	return createServerClient<Database>(
		env.NEXT_PUBLIC_SUPABASE_URL,
		supabaseKey,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						for (const { name, value, options } of cookiesToSet) {
							cookieStore.set(name, value, options);
						}
					} catch {
						// The `set` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		},
	);
};

// This omits RLS checks.
export const createAdminClient = async () => {
	return createClient(env.SUPABASE_SERVICE_ROLE_KEY);
};
