import { TaggedError } from './tagged-error';

export class AuthInternalError extends TaggedError<'AuthInternalError'> {
	constructor(options: ErrorOptions = {}) {
		super('Authentication operation failed', options);
	}
}

export type AuthError = AuthInternalError;
