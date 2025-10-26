import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';

import { GEMINI_API_KEY } from '$env/static/private';

const google = createGoogleGenerativeAI({
  apiKey: GEMINI_API_KEY,
});

export async function POST({ request }) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
