// See https://svelte.dev/docs/kit/types#app.d.ts
import type { Session, User } from "$lib/types/auth";

declare global {
  namespace App {
    interface Locals {
      session?: Session["session"] | null;
      user?: Session["user"] | null;
    }
  }
}
