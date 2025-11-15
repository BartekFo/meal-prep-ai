import { GEMINI_API_KEY } from '$env/static/private';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const google = createGoogleGenerativeAI({
	apiKey: GEMINI_API_KEY
});
