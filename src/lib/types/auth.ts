import type { auth } from '$lib/auth';

// Infer proper types from the Better Auth instance
export type Session = typeof auth.$Infer.Session;

// Extract the user type from the session
export type User = Session['user'];