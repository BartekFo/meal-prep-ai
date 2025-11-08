// See https://svelte.dev/docs/kit/types#app.d.ts
import type { Session } from '$lib/types/auth';

declare module 'bun:sqlite' {
	export class Database {
		constructor(path: string, options?: { strict?: boolean });
		exec(sql: string): void;
		close(): void;
		prepare(query: string): Statement;
		query<T = unknown>(query: string): T[];
		run(query: string, ...params: unknown[]): { changes: number; lastInsertRowid: number };
	}

	export interface Statement {
		all<T = unknown>(...params: unknown[]): T[];
		get<T = unknown>(...params: unknown[]): T | undefined;
		run(...params: unknown[]): { changes: number; lastInsertRowid: number };
	}
}

declare global {
	namespace App {
		interface Locals {
			session?: Session['session'] | null;
			user?: Session['user'] | null;
		}
	}
}
