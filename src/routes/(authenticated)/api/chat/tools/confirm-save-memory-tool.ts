import { saveMemory } from '$lib/server/memory';
import { tool } from 'ai';
import z from 'zod';

export function createConfirmSaveMemoryTool(userId: string) {
	return tool({
		description:
			"Confirm saving a proposed memory to the user's memory store. Call this tool when the user confirms they want to save the proposed memory.",
		inputSchema: z.object({
			content: z.string().describe('The memory content to save'),
			context: z.string().describe('The context/reason for this memory')
		}),
		execute: async ({ content, context }) => {
			try {
				await saveMemory(userId, content, {
					context,
					source: 'chat_ai_proposed',
					type: 'ai_extracted'
				});

				return {
					success: true,
					message: 'Memory saved successfully!'
				};
			} catch (error) {
				return {
					success: false,
					error: error instanceof Error ? error.message : 'Failed to save memory'
				};
			}
		}
	});
}
