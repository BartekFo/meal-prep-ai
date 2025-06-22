import { auth } from "$lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { sequence } from "@sveltejs/kit/hooks";
import type { Handle } from "@sveltejs/kit";
import { authHandle } from "$lib/hooks/auth-handler";

const betterAuthHandle: Handle = async ({ event, resolve }) => {
  return await svelteKitHandler({ event, resolve, auth });
};

export const handle = sequence(
  betterAuthHandle,
  authHandle
);
