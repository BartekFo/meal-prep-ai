import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

if (!env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

// Extract file path from DATABASE_URL (format: file:/path/to/db.sqlite)
const dbPath = env.DATABASE_URL.replace('file:', '');

const sqlite = new Database(dbPath, { strict: true });

// Production-ready PRAGMA settings
sqlite.exec('PRAGMA journal_mode = WAL');
sqlite.exec('PRAGMA synchronous = NORMAL');
sqlite.exec('PRAGMA temp_store = MEMORY');
sqlite.exec('PRAGMA mmap_size = 30000000000');
sqlite.exec('PRAGMA page_size = 8192');
sqlite.exec('PRAGMA cache_size = -20000'); // ~160MB cache

// WAL checkpoint management
sqlite.exec('PRAGMA wal_autocheckpoint = 1000');

// Optional: Manual checkpoint utility (runs every hour)
const checkpointInterval = setInterval(() => {
	sqlite.exec('PRAGMA wal_checkpoint(TRUNCATE)');
}, 3600000); // 1 hour

// Cleanup on process exit
if (typeof process !== 'undefined') {
	process.on('exit', () => {
		clearInterval(checkpointInterval);
		sqlite.close();
	});
}

export const db = drizzle(sqlite, { schema });
