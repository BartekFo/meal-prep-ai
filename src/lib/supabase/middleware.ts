import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/env";
import type { Database } from "./database.types";

export const updateSession = async (request: NextRequest) => {
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
	const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");

	// Redirect to sign-in if accessing protected routes while unauthenticated
	if (isProtectedRoute && user.error) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Redirect unauthenticated users from root to sign-in
	if (request.nextUrl.pathname === "/" && user.error) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Redirect authenticated users from root to dashboard
	if (request.nextUrl.pathname === "/" && !user.error) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return response;
};
