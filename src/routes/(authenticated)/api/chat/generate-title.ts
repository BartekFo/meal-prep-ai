import { GEMINI_API_KEY } from '$env/static/private';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, type UIMessage } from 'ai';

const google = createGoogleGenerativeAI({
	apiKey: GEMINI_API_KEY
});

export async function generateTitleFromMessage(message: UIMessage): Promise<string> {
	const textPart = message.parts.find((p) => p.type === 'text');
	if (!textPart || !('text' in textPart)) {
		return 'New Chat';
	}

	const userMessage = textPart.text;

	try {
		const { text } = await generateText({
			model: google('gemini-2.5-flash-lite'),
			prompt: `Generate a concise, descriptive title (max 6 words) for a chat conversation that starts with this message: "${userMessage}"

Return only the title, nothing else.`
		});

		return text.trim() || 'New Chat';
	} catch (error) {
		console.error('Failed to generate chat title:', error);
		const fallback = userMessage.length > 50 ? `${userMessage.slice(0, 47)}...` : userMessage;
		return fallback;
	}
}
