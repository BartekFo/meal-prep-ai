import { TaggedError } from './tagged-error';

export class MemoryInternalError extends TaggedError<'MemoryInternalError'> {
	constructor(options: ErrorOptions = {}) {
		super('Memory operation failed', options);
	}
}

export type MemoryError = MemoryInternalError;
