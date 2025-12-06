import { errAsync, ResultAsync } from 'neverthrow';
import { LocalStorage } from '$lib/storage';

// Security constants
const ALLOWED_MIME_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
	'image/gif'
] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'] as const;

export function uploadRecipeImage(file: File | undefined, userId: string) {
	if (!file || file.size === 0) {
		return errAsync(new Error('No file provided'));
	}

	// Validate file type
	if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
		return errAsync(
			new Error(`Invalid file type. Only images are allowed (${ALLOWED_MIME_TYPES.join(', ')})`)
		);
	}

	// Validate file size
	if (file.size > MAX_FILE_SIZE) {
		return errAsync(new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`));
	}

	// Generate safe filename (don't use user-provided filename directly)
	const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';

	// Validate extension as additional check
	if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
		return errAsync(new Error('Invalid file extension'));
	}

	// Generate cryptographically secure random filename
	const randomId = crypto.randomUUID();
	const filename = `${Date.now()}-${randomId}.${ext}`;
	const imagePath = `recipes/${userId}/${filename}`;

	const storage = new LocalStorage();

	return ResultAsync.fromPromise(
		storage.upload(file, imagePath),
		() => new Error('Failed to upload image to storage')
	);
}
