import { GEMINI_API_KEY } from '$env/static/private';
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
			dimension: 1536
		}
	},
	llm: {
		provider: 'google',
		config: {
			apiKey: GEMINI_API_KEY,
			model: 'gemini-2.5-flash-lite'
		}
	},
	historyDbPath: './data/db.sqlite'
};

export const memory = new Memory(memoryConfig);
