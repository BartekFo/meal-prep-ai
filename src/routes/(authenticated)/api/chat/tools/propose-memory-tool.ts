import type { ProposedMemoryOutput } from '$lib/modules/chef/components/memory/types';
import { tool } from 'ai';
import z from 'zod';

const proposeMemoryInputSchema = z.object({
	content: z
		.string()
		.describe(
			'The summarized memory to save (e.g., "User is allergic to peanuts" or "User prefers spicy food")'
		),
	context: z
		.string()
		.describe('Brief explanation of why this is worth remembering (e.g., "Dietary restriction")')
});

export function createProposeMemoryTool() {
	return tool({
		description:
			"Propose saving important information to the user's memory. Use this when the user shares important preferences, dietary restrictions, allergies, cooking habits, or other context worth remembering. Extract and summarize the key fact that should be remembered.",
		inputSchema: proposeMemoryInputSchema,
		execute: async ({ content, context }): Promise<ProposedMemoryOutput> => {
			return {
				content,
				context
			};
		}
	});
}
