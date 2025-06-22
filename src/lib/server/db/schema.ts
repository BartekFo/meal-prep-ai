import { MEAL_TYPES } from "../../constants/meal-types";
import { pgTable, text, timestamp, boolean, uuid, bigint, integer, jsonb, varchar, bigserial, primaryKey, pgEnum } from "drizzle-orm/pg-core";

export const mealTypeEnum = pgEnum('meal_type', MEAL_TYPES);

export const user = pgTable("user", {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
	dateOfBirth: timestamp('date_of_birth'),
	gender: text('gender'),
	activityLevel: text('activity_level'),
	currentWeight: integer('current_weight'),
	height: integer('height'),
	weightGoal: text('weight_goal'),
	dietaryPreferences: text('dietary_preferences').array(),
	dislikedIngredients: text('disliked_ingredients').array()
});

export const session = pgTable("session", {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable("account", {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
});

export const chat = pgTable("chat", {
	id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	createdAt: timestamp('created_at', { withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	title: text('title').notNull(),
	userId: text('user_id').notNull().references(() => user.id)
});

export const dietaryOptions = pgTable("dietary_options", {
	id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	description: text('description').notNull(),
	icon: text('icon').notNull()
});

export const favorites = pgTable("favorites", {
	id: bigserial('id', { mode: 'number' }).primaryKey(),
	createdAt: timestamp('created_at', { withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	recipeId: bigint('recipe_id', { mode: 'number' }).notNull().references(() => recipes.id),
	userId: text('user_id').notNull().references(() => user.id)
});

export const message = pgTable("message", {
	id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	chatId: uuid('chat_id').notNull().references(() => chat.id),
	role: varchar('role').notNull(),
	parts: jsonb('parts').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).$defaultFn(() => new Date()).notNull()
});

export const preferences = pgTable("preferences", {
	id: bigserial('id', { mode: 'number' }).primaryKey(),
	createdAt: timestamp('created_at', { withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	key: text('key').notNull(),
	value: text('value').notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	userId: text('user_id').notNull().references(() => user.id)
});

export const recipes = pgTable("recipes", {
	id: bigserial('id', { mode: 'number' }).primaryKey(),
	createdAt: timestamp('created_at', { withTimezone: true }).$defaultFn(() => new Date()).notNull(),
	userId: text('user_id').notNull().references(() => user.id),
	title: text('title').notNull(),
	description: text('description'),
	ingredients: text('ingredients').array().notNull(),
	servings: integer('servings').notNull(),
	prepTime: bigint('prep_time', { mode: 'number' }).notNull(),
	cookTime: bigint('cook_time', { mode: 'number' }).notNull(),
	mealType: mealTypeEnum('meal_type').notNull(),
	instructions: text('instructions').array().notNull(),
	imageUrl: text('image_url'),
	calories: integer('calories').notNull(),
	protein: integer('protein').notNull(),
	carbs: integer('carbs').notNull(),
	fat: integer('fat').notNull()
});

export const stream = pgTable("stream", {
	id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	chatId: uuid('chat_id').notNull().references(() => chat.id),
	createdAt: timestamp('created_at', { withTimezone: true }).$defaultFn(() => new Date()).notNull()
});

export const vote = pgTable("vote", {
	chatId: uuid('chat_id').notNull().references(() => chat.id),
	messageId: uuid('message_id').notNull().references(() => message.id),
	isUpvoted: boolean('is_upvoted').notNull()
}, (table) => [
	primaryKey({ columns: [table.chatId, table.messageId] })
]);
