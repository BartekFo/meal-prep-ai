import { errAsync, ResultAsync } from 'neverthrow';
import { createStorage } from '$lib/storage';

export async function uploadAvatar(file: File, userId: string) {
  if (!file || file.size === 0) {
    return errAsync(new Error('No file provided'));
  }

  const storage = createStorage();
  const filename = `${Date.now()}-${file.name}`;
  const imagePath = `avatars/${userId}/${filename}`;

  return ResultAsync.fromPromise(storage.upload(file, imagePath), () => new Error('Failed to upload image to storage'))
}
