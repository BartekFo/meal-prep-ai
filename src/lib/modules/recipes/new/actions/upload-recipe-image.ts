import { createStorage } from '$lib/storage';
import { errAsync, ResultAsync } from 'neverthrow';

export async function uploadRecipeImage(file: File | undefined, userId: string) {
	if (!file || file.size === 0) {
		return errAsync(new Error('No file provided'));
	}

	const storage = createStorage();
	const filename = `${Date.now()}-${file.name}`;
	const imagePath = `recipes/${userId}/${filename}`;

	return ResultAsync.fromPromise(
		storage.upload(file, imagePath),
		() => new Error('Failed to upload image to storage')
	);
}
