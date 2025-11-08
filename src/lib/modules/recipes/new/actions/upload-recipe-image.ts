import { errAsync, ResultAsync } from 'neverthrow';
import { LocalStorage } from '$lib/storage';

export function uploadRecipeImage(file: File | undefined, userId: string) {
	if (!file || file.size === 0) {
		return errAsync(new Error('No file provided'));
	}

	const storage = new LocalStorage();
	const filename = `${Date.now()}-${file.name}`;
	const imagePath = `recipes/${userId}/${filename}`;

	return ResultAsync.fromPromise(
		storage.upload(file, imagePath),
		() => new Error('Failed to upload image to storage')
	);
}
