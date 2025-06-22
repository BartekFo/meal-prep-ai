import { auth } from "$lib/auth";
import { redirect } from "@sveltejs/kit";
import type { Handle } from "@sveltejs/kit";

const publicRoutes = ['/login', '/sign-up'];

export const authHandle: Handle = async ({ event, resolve }) => {
  const isPublicRoute = publicRoutes.some(route =>
    event.url.pathname.startsWith(route)
  );

  const session = await auth.api.getSession({
    headers: event.request.headers
  });

  event.locals.session = session;

  if (!isPublicRoute && !session?.user) {
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

  return resolve(event);
}; 
