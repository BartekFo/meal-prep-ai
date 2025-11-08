# PostgreSQL to SQLite Migration Plan

## Strategic Decision: Keep Drizzle ORM

**Recommendation: Keep Drizzle ORM with bun:sqlite driver**

### Why Keep Drizzle:
- **Type Safety**: Your codebase relies heavily on type inference (`typeof recipes.$inferInsert`, typed queries)
- **Migration Safety**: Drizzle generates and tracks schema changes systematically
- **Query Compatibility**: Most queries (filters, joins, transactions) work identically across dialects
- **Better Auth Integration**: Drizzle adapter works seamlessly with SQLite
- **Minimal Code Changes**: Only schema definitions need updates, business logic stays the same

### Migration Tasks:

## Phase 1: Schema Migration (30-45 min)

### 1. Update schema.ts - Convert PostgreSQL types to SQLite equivalents

**Import changes:**
```typescript
// FROM:
import { pgTable, pgEnum, bigserial, jsonb, ... } from 'drizzle-orm/pg-core';

// TO:
import { sqliteTable, integer, text, blob, ... } from 'drizzle-orm/sqlite-core';
```

**Type conversions:**
- `pgTable` → `sqliteTable`
- `pgEnum('meal_type', [...])` → Remove (use text with check constraint instead)
- `bigserial('id', { mode: 'number' })` → `integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true })`
- `jsonb('column')` → `text('column', { mode: 'json' })` or `blob('column', { mode: 'json' })`
- `text('column').array()` → `text('column', { mode: 'json' })` (store arrays as JSON)
- `timestamp('column')` → Keep as-is (Drizzle handles SQLite date conversion)
- `uuid('id')` → `text('id')` (store UUIDs as text in SQLite)
- `bigint('column', { mode: 'number' })` → `integer('column', { mode: 'number' })`

**Specific schema changes needed:**

1. **mealTypeEnum** - Remove enum, use text with validation:
```typescript
// Remove: export const mealTypeEnum = pgEnum('meal_type', MEAL_TYPES);
// In recipes table: mealType: text('meal_type').notNull()
```

2. **Arrays** - Convert to JSON storage:
```typescript
// user.preferredMealTypes
preferredMealTypes: text('preferred_meal_types', { mode: 'json' }).$type<string[]>(),

// recipes.ingredients and recipes.instructions
ingredients: text('ingredients', { mode: 'json' }).$type<string[]>().notNull(),
instructions: text('instructions', { mode: 'json' }).$type<string[]>().notNull(),
```

3. **Auto-increment IDs**:
```typescript
// recipes, favorites, preferences tables
id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
```

4. **UUIDs**:
```typescript
// chat, message, stream, dietary_options tables
id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
```

### 2. Update database connection (src/lib/server/db/index.ts)

```typescript
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

export const db = drizzle(sqlite, { schema });
```

### 3. Update Drizzle config (drizzle.config.ts)

```typescript
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
```

## Phase 2: Better Auth Configuration (15 min)

### 4. Update auth adapter (src/lib/auth/index.ts)

```typescript
export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite' // Changed from 'pg'
	}),
	// ... rest stays the same
});
```

## Phase 3: Data Migration Script (30-45 min)

### 5. Create migration utility (src/lib/server/db/migrate-pg-to-sqlite.ts)

```typescript
import { Database as BunDatabase } from 'bun:sqlite';
import postgres from 'postgres';
import { drizzle as pgDrizzle } from 'drizzle-orm/postgres-js';
import { drizzle as sqliteDrizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema';

const PG_URL = process.env.PG_DATABASE_URL; // Your current PostgreSQL URL
const SQLITE_PATH = process.env.DATABASE_URL?.replace('file:', '') || './data/db.sqlite';

async function migrateData() {
	// Connect to both databases
	const pgClient = postgres(PG_URL!);
	const pgDb = pgDrizzle(pgClient, { schema });

	const sqliteDb = new BunDatabase(SQLITE_PATH, { strict: true });
	const sqlite = sqliteDrizzle(sqliteDb, { schema });

	console.log('Starting migration from PostgreSQL to SQLite...');

	// Migration order (respect foreign key constraints)
	const tables = [
		'user',
		'session',
		'account',
		'verification',
		'dietary_options',
		'chat',
		'recipes',
		'message',
		'stream',
		'vote',
		'favorites',
		'preferences'
	];

	for (const tableName of tables) {
		console.log(`Migrating ${tableName}...`);

		// Fetch all data from PostgreSQL
		const pgData = await pgDb.select().from(schema[tableName]);

		if (pgData.length === 0) {
			console.log(`  No data in ${tableName}`);
			continue;
		}

		// Transform data for SQLite
		const transformedData = pgData.map(row => {
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
		await sqlite.insert(schema[tableName]).values(transformedData);

		console.log(`  Migrated ${transformedData.length} rows`);
	}

	console.log('Migration complete!');

	await pgClient.end();
	sqliteDb.close();
}

migrateData().catch(console.error);
```

**Run migration:**
```bash
# Set environment variables
export PG_DATABASE_URL="postgresql://root:mysecretpassword@localhost:5434/local"
export DATABASE_URL="file:./data/db.sqlite"

# Run migration script
bun run src/lib/server/db/migrate-pg-to-sqlite.ts
```

## Phase 4: Production Configuration (20 min)

### 6. SQLite optimization setup

**Production PRAGMA settings** (already in db/index.ts):
- `PRAGMA journal_mode = WAL` - Write-Ahead Logging for concurrent reads during writes
- `PRAGMA synchronous = NORMAL` - Balance between safety and performance (safe with WAL)
- `PRAGMA temp_store = MEMORY` - Store temp tables in memory
- `PRAGMA mmap_size = 30000000000` - 30GB memory-mapped I/O
- `PRAGMA page_size = 8192` - Optimal page size for most workloads
- `PRAGMA cache_size = -20000` - ~160MB page cache
- `PRAGMA wal_autocheckpoint = 1000` - Checkpoint every 1000 pages

**WAL checkpoint management:**
Create a background job or cron task to periodically checkpoint:

```typescript
// Optional: Manual checkpoint utility
setInterval(() => {
	sqlite.exec('PRAGMA wal_checkpoint(TRUNCATE)');
}, 3600000); // Every hour
```

### 7. Deployment configuration

**VPS/Cloud VM Setup:**

1. **Database file location:**
```bash
# Create data directory
mkdir -p /var/lib/meal-prep-ai
chown -R app-user:app-user /var/lib/meal-prep-ai
```

2. **Environment variable:**
```env
DATABASE_URL=file:/var/lib/meal-prep-ai/db.sqlite
```

3. **Backup strategy:**
```bash
#!/bin/bash
# backup-sqlite.sh

BACKUP_DIR="/var/backups/meal-prep-ai"
DB_PATH="/var/lib/meal-prep-ai/db.sqlite"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# SQLite backup (safe even during writes with WAL mode)
sqlite3 "$DB_PATH" ".backup '$BACKUP_DIR/db_backup_$TIMESTAMP.sqlite'"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "db_backup_*.sqlite" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/db_backup_$TIMESTAMP.sqlite"
```

Add to crontab:
```bash
# Daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-sqlite.sh
```

4. **systemd service** (if using systemd):
```ini
[Unit]
Description=Meal Prep AI
After=network.target

[Service]
Type=simple
User=app-user
WorkingDirectory=/var/www/meal-prep-ai
Environment="DATABASE_URL=file:/var/lib/meal-prep-ai/db.sqlite"
Environment="NODE_ENV=production"
ExecStart=/usr/bin/bun run /var/www/meal-prep-ai/build/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

## Phase 5: Testing & Cleanup (30 min)

### 8. Verification testing

Create test script (test-sqlite-migration.ts):
```typescript
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

async function runTests() {
	console.log('Testing database operations...');

	// Test 1: Count rows in all tables
	const userCount = await db.select().from(schema.user);
	console.log(`✓ Users: ${userCount.length}`);

	const recipeCount = await db.select().from(schema.recipes);
	console.log(`✓ Recipes: ${recipeCount.length}`);

	// Test 2: Complex query with filters
	const { getAllRecipes } = await import('$lib/modules/recipes/db/queries');
	const recipes = await getAllRecipes('test-user-id', { search: 'chicken', sort: 'newest' });
	console.log(`✓ Recipe search: ${recipes.length} results`);

	// Test 3: Authentication query
	const sessions = await db.select().from(schema.session).limit(1);
	console.log(`✓ Session query works`);

	// Test 4: Array fields (JSON parsing)
	const recipesWithArrays = await db.select().from(schema.recipes).limit(1);
	if (recipesWithArrays[0]) {
		console.log(`✓ Ingredients type: ${typeof recipesWithArrays[0].ingredients}`);
		console.log(`✓ Instructions type: ${typeof recipesWithArrays[0].instructions}`);
	}

	console.log('\n✅ All tests passed!');
}

runTests().catch(console.error);
```

**Manual testing checklist:**
- [ ] User login/logout works
- [ ] Recipe creation with ingredients array
- [ ] Recipe filtering and search
- [ ] File uploads (recipe images)
- [ ] Onboarding flow
- [ ] Chat functionality
- [ ] Concurrent operations (open multiple browser tabs)

### 9. Remove PostgreSQL dependencies

**Update package.json:**
```bash
bun remove postgres
```

**Remove docker-compose.yml:**
```bash
rm docker-compose.yml
```

**Update package.json scripts:**
```json
{
	"scripts": {
		// Remove this line:
		// "db:start": "docker compose up",

		// Keep these (still work with SQLite):
		"db:push": "drizzle-kit push",
		"db:migrate": "drizzle-kit migrate",
		"db:generate": "drizzle-kit generate",
		"db:studio": "drizzle-kit studio"
	}
}
```

**Update CLAUDE.md:**
- Remove PostgreSQL/Docker references
- Update Database Commands section
- Add SQLite-specific notes about single-file database
- Update environment variables section
- Add backup strategy documentation

## Benefits of This Approach

✅ **Single-file database** - Easy backups, no Docker required
✅ **Zero network latency** - In-process database
✅ **Simpler deployment** - Just copy SQLite file
✅ **Keep all type safety** - Migration benefits from Drizzle
✅ **Minimal code changes** - Mostly schema definition updates
✅ **Better performance** - For single-user read/write patterns
✅ **Native Bun integration** - 2-3x faster than Node.js SQLite drivers
✅ **Production-ready** - WAL mode, proper PRAGMA settings, backup strategy

## Potential Issues & Solutions

### Issue: Array fields in SQLite
**Solution:** Store as JSON text with type casting (`$type<string[]>()`)

### Issue: Enum types
**Solution:** Use text fields with application-level validation or check constraints

### Issue: Concurrent writes
**Solution:** WAL mode handles this well for typical web app patterns

### Issue: Large result sets
**Solution:** SQLite with proper indexing handles millions of rows efficiently

### Issue: Database file locking
**Solution:** WAL mode allows concurrent reads during writes

## Estimated Timeline

- **Phase 1 (Schema)**: 30-45 minutes
- **Phase 2 (Auth)**: 15 minutes
- **Phase 3 (Data Migration)**: 30-45 minutes
- **Phase 4 (Production Config)**: 20 minutes
- **Phase 5 (Testing)**: 30 minutes

**Total: 2-3 hours**

## Rollback Plan

If issues arise:
1. Keep PostgreSQL running during initial SQLite testing
2. Maintain parallel databases until confident
3. Environment variable switch: `DATABASE_URL=postgresql://...` vs `DATABASE_URL=file:...`
4. Schema changes are the only code modifications needed
