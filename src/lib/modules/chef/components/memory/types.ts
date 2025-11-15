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
