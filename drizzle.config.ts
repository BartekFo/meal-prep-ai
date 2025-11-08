import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

// Extract file path from DATABASE_URL
const dbPath = process.env.DATABASE_URL.replace('file:', '');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'sqlite',
	dbCredentials: { url: dbPath },
	verbose: true,
	strict: true
});
