import { db } from '$lib/server/db';
import { dietaryOptions } from '$lib/server/db/schema';
import type { DietaryOption } from './types';

export async function getDietaryOptions(): Promise<DietaryOption[]> {
	return await db.select().from(dietaryOptions);
}
