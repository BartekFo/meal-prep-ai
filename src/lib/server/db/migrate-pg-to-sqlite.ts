import { Database as BunDatabase } from 'bun:sqlite';
import postgres from 'postgres';
import { drizzle as pgDrizzle } from 'drizzle-orm/postgres-js';
import { drizzle as sqliteDrizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema';

const PG_URL = process.env.PG_DATABASE_URL; // Your current PostgreSQL URL
const SQLITE_PATH = process.env.DATABASE_URL?.replace('file:', '') || './data/db.sqlite';

async function migrateData() {
	console.log('Starting migration from PostgreSQL to SQLite...');
	console.log(`Source: PostgreSQL (${PG_URL})`);
	console.log(`Destination: SQLite (${SQLITE_PATH})\n`);

	// Connect to PostgreSQL
	if (!PG_URL) {
		throw new Error('PG_DATABASE_URL is not set');
	}

	const pgClient = postgres(PG_URL);
	const pgDb = pgDrizzle(pgClient, { schema });

	// Connect to SQLite
	const sqliteDbInstance = new BunDatabase(SQLITE_PATH, { strict: true });
	const sqlite = sqliteDrizzle(sqliteDbInstance, { schema });

	// Migration order (respect foreign key constraints)
	const tables = [
		{ name: 'user', key: 'user' as const },
		{ name: 'session', key: 'session' as const },
		{ name: 'account', key: 'account' as const },
		{ name: 'verification', key: 'verification' as const },
		{ name: 'dietary_options', key: 'dietaryOptions' as const },
		{ name: 'chat', key: 'chat' as const },
		{ name: 'recipes', key: 'recipes' as const },
		{ name: 'message', key: 'message' as const },
		{ name: 'stream', key: 'stream' as const },
		{ name: 'vote', key: 'vote' as const },
		{ name: 'favorites', key: 'favorites' as const },
		{ name: 'preferences', key: 'preferences' as const }
	];

	let totalRowsMigrated = 0;

	for (const table of tables) {
		try {
			console.log(`Migrating ${table.name}...`);

			// Fetch all data from PostgreSQL
			const pgData = await pgDb.select().from(schema[table.key]);

			if (pgData.length === 0) {
				console.log(`  ✓ No data in ${table.name}`);
				continue;
			}

			// Transform data for SQLite
			const transformedData = pgData.map((row: Record<string, unknown>) => {
				const transformed = { ...row };

				// Convert arrays to JSON strings
				for (const key in transformed) {
					if (Array.isArray(transformed[key])) {
						transformed[key] = JSON.stringify(transformed[key]);
					}
				}

				return transformed;
			});

			// Bulk insert into SQLite (use transaction for performance)
			await sqlite.insert(schema[table.key]).values(transformedData as never);

			console.log(`  ✓ Migrated ${transformedData.length} rows`);
			totalRowsMigrated += transformedData.length;
		} catch (error) {
			console.error(`  ✗ Error migrating ${table.name}:`, error);
			throw error;
		}
	}

	console.log(`\n✅ Migration complete! Total rows migrated: ${totalRowsMigrated}`);

	await pgClient.end();
	sqliteDbInstance.close();
}

migrateData().catch((error) => {
	console.error('Migration failed:', error);
	process.exit(1);
});
