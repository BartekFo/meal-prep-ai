import { saveMemory } from '$lib/server/memory';
import { tool } from 'ai';
import z from 'zod';

const confirmSaveMemoryInputSchema = z.object({
	content: z.string().describe('The memory content to save'),
	context: z.string().describe('The context/reason for this memory')
});

export function createConfirmSaveMemoryTool(userId: string) {
	return tool({
		description:
			"Confirm saving a proposed memory to the user's memory store. Call this tool when the user confirms they want to save the proposed memory.",
		inputSchema: confirmSaveMemoryInputSchema,
		execute: async ({ content, context }) => {
			const result = await saveMemory(userId, content, {
				context,
				source: 'chat_ai_proposed',
				type: 'ai_extracted'
			});

			if (result.isErr()) {
				return {
					success: false,
					error: result.error.message || 'Failed to save memory'
				};
			}

			return {
				success: true,
				message: 'Memory saved successfully!'
			};
		}
	});
}
