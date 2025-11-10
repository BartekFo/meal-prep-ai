import { GEMINI_API_KEY } from '$env/static/private';
import type { User } from '$lib/types/auth';
import type { MemoryConfig } from 'mem0ai/oss';
import { Memory } from 'mem0ai/oss';

if (!GEMINI_API_KEY) {
	throw new Error('GEMINI_API_KEY is not set');
}

const memoryConfig: Partial<MemoryConfig> = {
	embedder: {
		provider: 'google',
		config: {
			apiKey: GEMINI_API_KEY,
			model: 'gemini-embedding-001'
		}
	},
	vectorStore: {
		provider: 'memory',
		config: {
			collectionName: 'memories',
			dimension: 768
		}
	},
	llm: {
		provider: 'google',
		config: {
			apiKey: GEMINI_API_KEY,
			model: 'gemini-2.5-flash-lite'
		}
	},
	historyStore: {
		provider: 'sqlite',
		config: {
			historyDbPath: './data/db.sqlite'
		}
	}
};

export const memory = new Memory(memoryConfig);

export async function getRelevantMemories(
	userId: string,
	query: string,
	limit = 5
): Promise<string[]> {
	try {
		const result = await memory.search(query, {
			userId,
			limit
		});
		return result.results.map((item) => item.memory);
	} catch (error) {
		console.error('Error retrieving memories:', error);
		return [];
	}
}

export function formatMemoriesForPrompt(memories: string[]): string {
	if (memories.length === 0) {
		return '';
	}
	return `\n\nRelevant context from previous conversations:\n${memories.map((m, i) => `${i + 1}. ${m}`).join('\n')}`;
}

export async function saveMemory(
	userId: string,
	content: string,
	metadata?: Record<string, unknown>
): Promise<void> {
	try {
		const options: { userId: string; metadata?: Record<string, unknown> } = { userId };
		if (metadata) {
			options.metadata = metadata;
		}
		await memory.add(content, options);
	} catch (error) {
		console.error('Error saving memory:', error);
	}
}

export async function seedInitialMemories(userId: string, user: User): Promise<void> {
	if (user.onboardingStatus !== 'completed') {
		return;
	}

	const preferredMeals =
		user.preferredMealTypes && Array.isArray(user.preferredMealTypes)
			? user.preferredMealTypes.join(', ')
			: 'not specified';

	const profileSummary = `
User Profile Information:
- Name: ${user.firstName} ${user.lastName}
- Date of Birth: ${user.dateOfBirth}
- Gender: ${user.gender}
- Weight: ${user.currentWeight} kg
- Height: ${user.height} cm
- Weight Goal: ${user.weightGoal}
- Activity Level: ${user.activityLevel}
- Dietary Type: ${user.dietaryType}
- Food Allergies: ${user.allergies || 'none'}
- Disliked Foods: ${user.dislikedFoods || 'none'}
- Preferred Meal Types: ${preferredMeals}
`.trim();

	await saveMemory(userId, profileSummary, { source: 'profile', type: 'user_info' });
}
