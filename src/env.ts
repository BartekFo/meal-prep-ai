import { createEnv } from "@t3-oss/env-nextjs";
import * as v from "valibot";

export const env = createEnv({
  server: {
    SUPABASE_SERVICE_ROLE_KEY: v.pipe(v.string(), v.minLength(1)),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: v.pipe(v.string(), v.url()),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: v.pipe(v.string(), v.minLength(1)),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
});
