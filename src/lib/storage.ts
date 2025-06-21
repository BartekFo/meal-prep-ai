import { writeFile, unlink, mkdir } from 'fs/promises';
import { join, dirname } from 'path';

interface StorageProvider {
  upload(file: File, path: string): Promise<string>;
  delete(path: string): Promise<void>;
}

class LocalStorage implements StorageProvider {
  private uploadsDir = 'uploads/';

  async upload(file: File, path: string): Promise<string> {
    const fullPath = join(this.uploadsDir, path);

    // Create directory structure if it doesn't exist
    await mkdir(dirname(fullPath), { recursive: true });

    await writeFile(fullPath, Buffer.from(await file.arrayBuffer()));

    return `uploads/${path}`;
  }

  async delete(path: string): Promise<void> {
    const fullPath = join(this.uploadsDir, path);
    await unlink(fullPath);
  }
}

// Future S3/Hetzner storage class
class S3Storage implements StorageProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async upload(_file: File, _path: string): Promise<string> {
    // TODO: Implement S3 upload
    throw new Error('S3 storage not implemented yet');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(_path: string): Promise<void> {
    // TODO: Implement S3 delete
    throw new Error('S3 storage not implemented yet');
  }
}

export function createStorage(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER || 'local';

  switch (provider) {
    case 'local':
      return new LocalStorage();
    case 's3':
      return new S3Storage();
    default:
      return new LocalStorage();
  }
}

export type { StorageProvider }; 
