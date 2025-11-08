import { Database } from 'bun:sqlite';

const dbPath = './data/db.sqlite';

console.log('🗄️  Initializing SQLite database...');
console.log(`📁 Database path: ${dbPath}`);

// Create database
const sqlite = new Database(dbPath);

// Create all tables
console.log('\n📋 Creating tables...\n');

const tables = [
	{
		name: 'user',
		sql: `CREATE TABLE IF NOT EXISTS user (
			id TEXT PRIMARY KEY NOT NULL,
			name TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			email_verified INTEGER NOT NULL,
			image TEXT,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			first_name TEXT,
			last_name TEXT,
			weight_goal TEXT,
			dietary_type TEXT,
			allergies TEXT,
			disliked_foods TEXT,
			preferred_meal_types TEXT,
			date_of_birth INTEGER,
			gender TEXT,
			activity_level TEXT,
			current_weight INTEGER,
			height INTEGER,
			onboarding_status TEXT NOT NULL,
			onboarding_completed_at INTEGER
		)`
	},
	{
		name: 'session',
		sql: `CREATE TABLE IF NOT EXISTS session (
			id TEXT PRIMARY KEY NOT NULL,
			expires_at INTEGER NOT NULL,
			token TEXT NOT NULL UNIQUE,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			ip_address TEXT,
			user_agent TEXT,
			user_id TEXT NOT NULL,
			FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE cascade
		)`
	},
	{
		name: 'account',
		sql: `CREATE TABLE IF NOT EXISTS account (
			id TEXT PRIMARY KEY NOT NULL,
			account_id TEXT NOT NULL,
			provider_id TEXT NOT NULL,
			user_id TEXT NOT NULL,
			access_token TEXT,
			refresh_token TEXT,
			id_token TEXT,
			access_token_expires_at INTEGER,
			refresh_token_expires_at INTEGER,
			scope TEXT,
			password TEXT,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE cascade
		)`
	},
	{
		name: 'verification',
		sql: `CREATE TABLE IF NOT EXISTS verification (
			id TEXT PRIMARY KEY NOT NULL,
			identifier TEXT NOT NULL,
			value TEXT NOT NULL,
			expires_at INTEGER NOT NULL,
			created_at INTEGER,
			updated_at INTEGER
		)`
	},
	{
		name: 'chat',
		sql: `CREATE TABLE IF NOT EXISTS chat (
			id TEXT PRIMARY KEY NOT NULL,
			created_at INTEGER NOT NULL,
			title TEXT NOT NULL,
			user_id TEXT NOT NULL,
			FOREIGN KEY (user_id) REFERENCES user(id)
		)`
	},
	{
		name: 'dietary_options',
		sql: `CREATE TABLE IF NOT EXISTS dietary_options (
			id TEXT PRIMARY KEY NOT NULL,
			title TEXT NOT NULL,
			description TEXT NOT NULL,
			icon TEXT NOT NULL
		)`
	},
	{
		name: 'message',
		sql: `CREATE TABLE IF NOT EXISTS message (
			id TEXT PRIMARY KEY NOT NULL,
			chat_id TEXT NOT NULL,
			role TEXT NOT NULL,
			parts TEXT NOT NULL,
			created_at INTEGER NOT NULL,
			FOREIGN KEY (chat_id) REFERENCES chat(id)
		)`
	},
	{
		name: 'stream',
		sql: `CREATE TABLE IF NOT EXISTS stream (
			id TEXT PRIMARY KEY NOT NULL,
			chat_id TEXT NOT NULL,
			created_at INTEGER NOT NULL,
			FOREIGN KEY (chat_id) REFERENCES chat(id)
		)`
	},
	{
		name: 'recipes',
		sql: `CREATE TABLE IF NOT EXISTS recipes (
			id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			created_at INTEGER NOT NULL,
			user_id TEXT NOT NULL,
			title TEXT NOT NULL,
			description TEXT,
			ingredients TEXT NOT NULL,
			servings INTEGER NOT NULL,
			prep_time INTEGER NOT NULL,
			cook_time INTEGER NOT NULL,
			meal_type TEXT NOT NULL,
			instructions TEXT NOT NULL,
			image_url TEXT,
			calories INTEGER NOT NULL,
			protein INTEGER NOT NULL,
			carbs INTEGER NOT NULL,
			fat INTEGER NOT NULL,
			image_data TEXT,
			image_type TEXT,
			image_size INTEGER,
			FOREIGN KEY (user_id) REFERENCES user(id)
		)`
	},
	{
		name: 'favorites',
		sql: `CREATE TABLE IF NOT EXISTS favorites (
			id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			created_at INTEGER NOT NULL,
			recipe_id INTEGER NOT NULL,
			user_id TEXT NOT NULL,
			FOREIGN KEY (recipe_id) REFERENCES recipes(id),
			FOREIGN KEY (user_id) REFERENCES user(id)
		)`
	},
	{
		name: 'preferences',
		sql: `CREATE TABLE IF NOT EXISTS preferences (
			id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			created_at INTEGER NOT NULL,
			key TEXT NOT NULL,
			value TEXT NOT NULL,
			updated_at INTEGER NOT NULL,
			user_id TEXT NOT NULL,
			FOREIGN KEY (user_id) REFERENCES user(id)
		)`
	},
	{
		name: 'vote',
		sql: `CREATE TABLE IF NOT EXISTS vote (
			chat_id TEXT NOT NULL,
			message_id TEXT NOT NULL,
			is_upvoted INTEGER NOT NULL,
			PRIMARY KEY (chat_id, message_id),
			FOREIGN KEY (chat_id) REFERENCES chat(id),
			FOREIGN KEY (message_id) REFERENCES message(id)
		)`
	}
];

for (const table of tables) {
	sqlite.exec(table.sql);
	console.log(`✓ ${table.name}`);
}

console.log('\n✅ Database initialized successfully!');
sqlite.close();
