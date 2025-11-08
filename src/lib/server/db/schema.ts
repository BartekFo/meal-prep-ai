import {
	integer,
	primaryKey,
	sqliteTable,
	text
} from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified')
		.$defaultFn(() => false)
		.notNull(),
	image: text('image'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	firstName: text('first_name'),
	lastName: text('last_name'),
	weightGoal: text('weight_goal'),
	dietaryType: text('dietary_type'),
	allergies: text('allergies'),
	dislikedFoods: text('disliked_foods'),
	preferredMealTypes: text('preferred_meal_types', { mode: 'json' }).$type<string[]>(),
	dateOfBirth: integer('date_of_birth', { mode: 'timestamp' }),
	gender: text('gender'),
	activityLevel: text('activity_level'),
	currentWeight: integer('current_weight'),
	height: integer('height'),
	onboardingStatus: text('onboarding_status', {
		enum: ['not_started', 'step1_completed', 'completed']
	})
		.$defaultFn(() => 'not_started')
		.notNull(),
	onboardingCompletedAt: integer('onboarding_completed_at', { mode: 'timestamp' })
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	token: text('token').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const account = sqliteTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
	refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const verification = sqliteTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const chat = sqliteTable('chat', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	title: text('title').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const dietaryOptions = sqliteTable('dietary_options', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	description: text('description').notNull(),
	icon: text('icon').notNull()
});

export const favorites = sqliteTable('favorites', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	recipeId: integer('recipe_id', { mode: 'number' })
		.notNull()
		.references(() => recipes.id),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const message = sqliteTable('message', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	chatId: text('chat_id')
		.notNull()
		.references(() => chat.id),
	role: text('role').notNull(),
	parts: text('parts', { mode: 'json' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull()
});

export const preferences = sqliteTable('preferences', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	key: text('key').notNull(),
	value: text('value').notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id)
});

export const recipes = sqliteTable('recipes', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	title: text('title').notNull(),
	description: text('description'),
	ingredients: text('ingredients', { mode: 'json' }).$type<string[]>().notNull(),
	servings: integer('servings').notNull(),
	prepTime: integer('prep_time', { mode: 'number' }).notNull(),
	cookTime: integer('cook_time', { mode: 'number' }).notNull(),
	mealType: text('meal_type').notNull(),
	instructions: text('instructions', { mode: 'json' }).$type<string[]>().notNull(),
	imageUrl: text('image_url'),
	calories: integer('calories').notNull(),
	protein: integer('protein').notNull(),
	carbs: integer('carbs').notNull(),
	fat: integer('fat').notNull(),
	imageData: text('image_data'),
	imageType: text('image_type'),
	imageSize: integer('image_size')
});

export const stream = sqliteTable('stream', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	chatId: text('chat_id')
		.notNull()
		.references(() => chat.id),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull()
});

export const vote = sqliteTable(
	'vote',
	{
		chatId: text('chat_id')
			.notNull()
			.references(() => chat.id),
		messageId: text('message_id')
			.notNull()
			.references(() => message.id),
		isUpvoted: integer('is_upvoted', { mode: 'boolean' }).notNull()
	},
	(table) => [primaryKey({ columns: [table.chatId, table.messageId] })]
);
