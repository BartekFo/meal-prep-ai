import { GEMINI_API_KEY } from '$env/static/private';
import type { User } from '$lib/types/auth';
import type { MemoryConfig } from 'mem0ai/oss';
import { Memory } from 'mem0ai/oss';
import { fromPromise, ok, safeTry, type ResultAsync } from 'neverthrow';
import { MemoryInternalError, type MemoryError } from '$lib/errors/memory';

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

export function getRelevantMemories(
	userId: string,
	query: string,
	limit = 5
): ResultAsync<string[], MemoryError> {
	return fromPromise(
		memory
			.search(query, {
				userId,
				limit
			})
			.then((result) => result.results.map((item) => item.memory)),
		(e) => new MemoryInternalError({ cause: e })
	);
}

export function formatMemoriesForPrompt(memories: string[]): string {
	if (memories.length === 0) {
		return '';
	}
	return `\n\nRelevant context from previous conversations:\n${memories.map((m, i) => `${i + 1}. ${m}`).join('\n')}`;
}

export function saveMemory(
	userId: string,
	content: string,
	metadata?: Record<string, unknown>
): ResultAsync<void, MemoryError> {
	return fromPromise(
		(async () => {
			const options: { userId: string; metadata?: Record<string, unknown> } = { userId };
			if (metadata) {
				options.metadata = metadata;
			}
			await memory.add(content, options);
		})(),
		(e) => new MemoryInternalError({ cause: e })
	);
}

export function seedInitialMemories(user: User): ResultAsync<void, MemoryError> {
	return safeTry(async function* () {
		if (user.onboardingStatus !== 'completed') {
			return ok(undefined);
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

		yield* saveMemory(user.id, profileSummary, { source: 'profile', type: 'user_info' });
		return ok(undefined);
	});
}

export function getAllMemories(userId: string, limit = 100): ResultAsync<unknown[], MemoryError> {
	return fromPromise(
		memory.getAll({ userId, limit }).then((result) => result.results),
		(e) => new MemoryInternalError({ cause: e })
	);
}

export function deleteMemory(memoryId: string): ResultAsync<boolean, MemoryError> {
	return fromPromise(
		memory.delete(memoryId).then(() => true),
		(e) => new MemoryInternalError({ cause: e })
	);
}
