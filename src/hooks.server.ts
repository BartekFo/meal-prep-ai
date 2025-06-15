import { auth } from "$lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { redirect } from "@sveltejs/kit";

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login', '/sign-up'];

export async function handle({ event, resolve }) {
  const response = await svelteKitHandler({ event, resolve, auth });

  const isProtectedRoute = protectedRoutes.some(route =>
    event.url.pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some(route =>
    event.url.pathname.startsWith(route)
  );

  const session = await auth.api.getSession({
    headers: event.request.headers
  });

  if (isProtectedRoute && !session?.user) {
    redirect(302, '/login');
  }

  if (isPublicRoute && session?.user) {
    redirect(302, '/dashboard');
  }

  if (event.url.pathname === '/') {
    if (session?.user) {
      redirect(302, '/dashboard');
    } else {
      redirect(302, '/login');
    }
  }

  return response;
}