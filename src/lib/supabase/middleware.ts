import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/env";
import type { Database } from "./database.types";

export const updateSession = async (request: NextRequest) => {
	// This `try/catch` block is only here for the interactive tutorial.
	// Feel free to remove once you have Supabase connected.
	try {
		// Create an unmodified response
		let response = NextResponse.next({
			request: {
				headers: request.headers,
			},
		});

		const supabase = createServerClient<Database>(
			env.NEXT_PUBLIC_SUPABASE_URL,
			env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
			{
				cookies: {
					getAll() {
						return request.cookies.getAll();
					},
					setAll(cookiesToSet) {
						for (const { name, value } of cookiesToSet) {
							request.cookies.set(name, value);
						}

						response = NextResponse.next({
							request,
						});

						for (const { name, value, options } of cookiesToSet) {
							response.cookies.set(name, value, options);
						}
					},
				},
			},
		);

		// This will refresh session if expired - required for Server Components
		// https://supabase.com/docs/guides/auth/server-side/nextjs
		const user = await supabase.auth.getUser();

		// Check if the route is protected
		const isProtectedRoute =
			request.nextUrl.pathname.startsWith("/dashboard") ||
			request.nextUrl.pathname.startsWith("/project");

		// Redirect to sign-in if accessing protected routes while unauthenticated
		if (isProtectedRoute && user.error) {
			return NextResponse.redirect(new URL("/sign-in", request.url));
		}

		// Redirect unauthenticated users from root to sign-in
		if (request.nextUrl.pathname === "/" && user.error) {
			return NextResponse.redirect(new URL("/sign-in", request.url));
		}

		// Redirect authenticated users from root to dashboard
		if (request.nextUrl.pathname === "/" && !user.error) {
			return NextResponse.redirect(new URL("/dashboard", request.url));
		}

		return response;
	} catch {
		// If you are here, a Supabase client could not be created!
		// This is likely because you have not set up environment variables.
		// Check out http://localhost:3000 for Next Steps.
		return NextResponse.next({
			request: {
				headers: request.headers,
			},
		});
	}
};
