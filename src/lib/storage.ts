import { mkdir, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

type StorageProvider = {
  upload(file: File, path: string): Promise<string>;
  delete(path: string): Promise<void>;
};

export class LocalStorage implements StorageProvider {
  private readonly uploadsDir = "uploads/";

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

export type { StorageProvider };
