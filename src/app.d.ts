// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface Locals {
			session?: {
				user: {
					id: string;
					name: string;
					email: string;
				};
			} | null;
		}
	}
}

export { };
