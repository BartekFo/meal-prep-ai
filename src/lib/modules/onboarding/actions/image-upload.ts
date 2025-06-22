import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const UPLOAD_DIR = 'uploads/avatars';

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  try {
    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${userId}-${randomUUID()}.${fileExtension}`;
    const filePath = join(UPLOAD_DIR, fileName);

    // Convert file to buffer and save
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Return relative URL path
    return `/${filePath}`;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw new Error('Failed to upload avatar');
  }
}

export async function deleteAvatar(avatarUrl: string): Promise<void> {
  try {
    // TODO: Implement avatar deletion
    console.log('Deleting avatar:', avatarUrl);
  } catch (error) {
    console.error('Error deleting avatar:', error);
  }
} 
