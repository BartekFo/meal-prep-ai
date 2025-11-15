export type Memory = {
	id: string;
	memory: string;
	created_at?: string;
	metadata?: {
		source?: string;
		type?: string;
		chatId?: string;
	};
};

export type ProposedMemoryOutput = {
	content: string;
	context: string;
};
