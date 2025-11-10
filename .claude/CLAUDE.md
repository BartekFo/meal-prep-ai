# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

### Essential Commands

```bash
# Start development server with hot reload
bun run dev

# Run quality checks before committing
bun run check && bun run lint:fix && bun run format
```

## Development Commands

### Core Development

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally
- `bun run check` - Run TypeScript and Svelte checks (watch mode: `bun run check:watch`)
- `bun run format` - Format code with Prettier
- `bun run lint` - Run ESLint validation
- `bun run lint:fix` - Auto-fix ESLint issues and format code

### Database Commands

- `bun run db:push` - Push schema changes to SQLite database
- `bun run db:migrate` - Run database migrations
- `bun run db:generate` - Generate new migration files from schema changes
- `bun run db:studio` - Open Drizzle Studio (visual database explorer)
- `bun run db:seed` - Seed database with initial data
- `bun run db:test` - Test SQLite migration

**Note:** Database is a single SQLite file specified by `DATABASE_URL` environment variable (format: `file:/path/to/db.sqlite`). No Docker required.

## Technology Stack

### Core Technologies

- **Frontend**: SvelteKit 2.37.0 with Svelte 5 (runes system) and TypeScript 5.9.2
- **Styling**: Tailwind CSS 4.1.12 + CSS modules
- **Database**: SQLite with Drizzle ORM 0.44.5 (type-safe queries)
- **Authentication**: Better Auth 1.3.7 with email/password
- **UI Components**: Custom components based on bits-ui 2.11.0
- **Forms**: sveltekit-superforms + arktype for validation
- **Error Handling**: neverthrow for Result pattern
- **AI Integration**: Vercel AI SDK 5.0.80 (@ai-sdk/google) + mem0ai
- **Package Manager**: Bun (TypeScript-first runtime)

### Database Schema

- **Users**: Extended with onboarding fields (dietary preferences, physical stats)
- **Recipes**: Full recipe data with nutrition information and meal type classification
- **Authentication**: Better Auth tables for sessions, accounts, verification
- **Additional**: Chat, favorites, preferences for future features

### Key Architectural Patterns

#### Module Organization

Each feature module follows a consistent structure:

```
src/lib/modules/[feature]/
├── actions/              # Server actions (form submissions, API calls)
├── components/           # Feature-specific Svelte components
├── db/
│   └── queries.ts       # Database queries for this module
├── schema/              # arktype validation schemas
├── index.ts             # Public API exports
└── types.ts            # Module-specific types (if needed)
```

Modules are feature-focused and self-contained, promoting maintainability and scalability.

#### Authentication Flow

- **Provider**: Better Auth with email/password + Drizzle adapter
- **Session**: Database-persisted via Better Auth tables
- **Protection**: All `/api` and `/(authenticated)` routes protected by `hooks.server.ts`
- **User Model**: Extended with onboarding status and preferences
- **Client Access**: Use `$lib/auth/auth-client` for session management

#### Form Handling

- **Validation**: arktype for runtime type validation (preferred over Zod)
- **State**: sveltekit-superforms for form state and error management
- **Components**: formsnap for enhanced accessible form fields
- **Server Actions**: Place in `actions/` folder, return `{ success, error }` objects
- **Type Safety**: Full TypeScript support, no `any` types

Example:

```typescript
// Schema definition (arktype)
export const recipeSchema = type({
	name: 'string',
	ingredients: 'string[]',
	instructions: 'string',
	nutrition: type({
		calories: 'number',
		protein: 'number'
	})
});

// Server action
export const createRecipe = async (event, formData) => {
	const validation = recipeSchema(formData);
	if (validation instanceof type.errors) {
		return { success: false, error: validation.toString() };
	}
	// Process validated data
	return { success: true, recipeId };
};
```

#### Error Handling

- **Pattern**: Use neverthrow `Result<T, E>` type for all operations
- **Database**: All queries return `Result` type for consistent error handling
- **Server Actions**: Return `{ success: boolean, error?: string, data?: T }`
- **Composability**: Use `.match()`, `.isOk()`, `.isErr()` for control flow
- **No Exceptions**: Prefer explicit error returns over try/catch

Example:

```typescript
function getUser(id: string): Result<User, Error> {
	const user = db.query.users.findById(id);
	return user ? ok(user) : err(new Error('User not found'));
}
```

### UI Component Guidelines

- **Reuse First**: Always check `src/lib/components/ui/` before creating new components
- **Styling**: Use Tailwind CSS utilities in markup or CSS modules for scoped styles (no inline styles)
- **Accessibility**: Built on bits-ui which follows WAI-ARIA standards
- **Props**: Be explicit with types - no `any` types
- **Composition**: Use slots for flexible component composition
- **Dark Mode**: Use `dark:` prefix for dark theme styles (mode-watcher handles toggle)

Example component:

```svelte
<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	interface Props {
		title: string;
		disabled?: boolean;
		onclick?: () => void;
	}

	let { title, disabled = false, onclick }: Props = $props();
</script>

<Button {disabled} on:click={onclick} class="w-full">
	{title}
</Button>
```

### Code Style & Standards

#### TypeScript Configuration

- **Strict Mode**: All TypeScript strict flags enabled
- **No `any` Types**: Prohibited - use proper types or `unknown` with narrowing
- **Exact Optional Properties**: Required (no partial matching)
- **Unchecked Index Access**: Prohibited (use type guards)
- **Module Detection**: Forced (CommonJS not supported)

#### Naming Conventions

- **Files/Folders**: kebab-case (e.g., `add-recipe-form.svelte`, `auth-handler.ts`)
- **Components**: PascalCase (e.g., `RecipeCard.svelte`, but filename is `recipe-card.svelte`)
- **Functions/Variables**: camelCase (e.g., `getUserById`, `isLoading`)
- **Constants**: camelCase (e.g., `maxRecipeSize`, use UPPER_CASE only for module-level constants)
- **Types/Interfaces**: PascalCase (e.g., `type Recipe`, `interface User`)
- **Private/Internal**: Prefix with `_` (e.g., `_internalHelper`, `_privateField`)

#### Code Quality Rules (ESLint)

- **Unused Variables**: Removed automatically - prefix with `_` if intentional (e.g., `_unused`)
- **No Console Logs**: Remove all debug logs from production code
- **Import Organization**: Group external → internal imports
- **No Undef**: Relies on TypeScript (rule disabled in ESLint)

#### Svelte Best Practices

- **Script Tag**: Always use `<script lang="ts">` for TypeScript
- **Props**: Define with explicit types using `Props` interface + destructuring
- **Runes**: Use Svelte 5 runes for state management
  - `$state()` for reactive variables
  - `$derived()` for computed values
  - `$effect()` for side effects
- **Stores**: Prefer `.svelte.ts` files for store definitions
- **Lifecycle**: Use `onMount()`, `onDestroy()` from `svelte` when needed

#### Database & ORM (Drizzle)

- **Schema**: Defined in `src/lib/server/db/schema.ts` (single source of truth)
- **Queries**: Use Drizzle's type-safe query builder, not raw SQL
- **Migrations**: Auto-generated, stored in `drizzle/` folder
- **JSON Fields**: Use `.json()` for arrays - Drizzle handles serialization
- **Type Safety**: Leverage Drizzle's `InferSelectModel` for query results

Example:

```typescript
import { InferSelectModel, eq } from 'drizzle-orm';
import { recipes } from '$lib/server/db/schema';

export type Recipe = InferSelectModel<typeof recipes>;

export async function getRecipe(id: string): Promise<Recipe | null> {
	const result = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);

	return result[0] ?? null;
}
```

#### Form & Validation

- **Schema**: Always use arktype (not Zod)
- **Server Actions**: Place in `actions/` folders with consistent naming
- **Return Pattern**: `{ success: boolean, error?: string, data?: T }`
- **Error Messages**: User-friendly, no stack traces exposed

#### Comments & Documentation

- **JSDoc**: Use for exported functions and complex logic
- **Inline Comments**: Sparingly - prefer clear code
- **TODO Comments**: Mark with `// TODO:` for future work
- **Type Comments**: Use TSDoc syntax for complex types

#### File Organization

- **Barrel Exports**: Use `index.ts` to centralize module exports
- **Circular Dependencies**: Avoid by proper module organization
- **Path Aliases**: Use `$lib` for `src/lib/` imports only

### Database Development

#### Schema Management

- **Single Source of Truth**: All schema defined in `src/lib/server/db/schema.ts`
- **Migrations**: Auto-generated via `bun run db:generate` after schema changes
- **Migration Flow**:
  1. Update `schema.ts`
  2. Run `bun run db:generate` (creates migration file)
  3. Review migration in `drizzle/` folder
  4. Run `bun run db:push` to apply

#### SQLite Configuration

- **WAL Mode**: Write-Ahead Logging for concurrent read/write operations
- **PRAGMA Settings**: Configured in `src/lib/server/db/index.ts`
  - `journal_mode = WAL` - Concurrent operations
  - `synchronous = NORMAL` - Balanced safety/performance
  - `cache_size = -20000` - ~160MB page cache
  - `wal_autocheckpoint = 1000` - Automatic checkpoints
- **Single File**: `data/db.sqlite` (easily backupable)
- **Backups**: Simply copy the database file (safe even during operations)

#### Development Workflow

```bash
# View database with visual explorer
bun run db:studio

# After schema changes
bun run db:generate
# Review migration file
bun run db:push

# Seed data if needed
bun run db:seed
```

#### Type Safety with Drizzle

```typescript
// Infer types from schema
type Recipe = InferSelectModel<typeof recipes>;
type NewRecipe = InferInsertModel<typeof recipes>;

// Type-safe queries (no SQL injection possible)
const recipe = await db.select().from(recipes).where(eq(recipes.id, recipeId)).limit(1);
```

### API Endpoints

#### Chat Streaming (AI Features)

- **Endpoint**: `POST /api/chat`
- **Protocol**: Server-Sent Events (SSE) for streaming
- **Implementation**: Located at `src/routes/(authenticated)/api/chat/+server.ts`
- **Features**: Uses Vercel AI SDK with Google Gemini + mem0ai for memory

### File Uploads

- **Storage**: `uploads/recipes/[userId]/[filename]`
- **Handling**: Server actions in `recipes/new/actions/upload-recipe-image.ts`
- **Database**: File URLs stored in recipes table
- **Security**: Files accessible via authenticated routes only

### Environment Variables

All required variables should be in `.env` file (never commit):

```bash
# Database connection (required)
DATABASE_URL=file:./data/db.sqlite

# AI features (required for /chef route)
GOOGLE_API_KEY=your_google_api_key_here

# mem0ai for persistent memory (optional but recommended for chef)
MEM0_API_KEY=your_mem0_api_key_here
```

- **Development**: `DATABASE_URL=file:./data/db.sqlite`
- **Production**: `DATABASE_URL=file:/var/lib/meal-prep-ai/db.sqlite`

### Production Deployment

#### Database File Setup

```bash
mkdir -p /var/lib/meal-prep-ai
chown -R app-user:app-user /var/lib/meal-prep-ai
```

#### Backup Strategy

- Use `scripts/backup-sqlite.sh` for automated backups
- Backups are safe even during concurrent operations (WAL mode)
- Keep 7 days of rolling backups
- Add to crontab: `0 2 * * * /usr/local/bin/backup-sqlite.sh` (daily at 2 AM)

#### Systemd Service

- Use `deployment/meal-prep-ai.service` for systemd integration
- Provides security hardening and resource limits
- Automatically restarts on failure

#### SQLite PRAGMA Settings (Production)

- `PRAGMA journal_mode = WAL` - Write-Ahead Logging for concurrent operations
- `PRAGMA synchronous = NORMAL` - Balanced safety/performance (safe with WAL)
- `PRAGMA temp_store = MEMORY` - In-memory temp tables
- `PRAGMA cache_size = -20000` - ~160MB page cache
- `PRAGMA wal_autocheckpoint = 1000` - Checkpoint every 1000 pages
- Automatic hourly manual checkpoint for WAL cleanup

## Task Completion Checklist

Before marking any task as complete, ensure:

### Code Quality

- [ ] TypeScript: `bun run check` passes (no type errors)
- [ ] Linting: `bun run lint` passes (all ESLint rules satisfied)
- [ ] Formatting: `bun run format` has been run
- [ ] Svelte: Svelte check passes (part of `bun run check`)
- [ ] Unused Imports: All removed automatically by ESLint
- [ ] No Console Logs: Removed all debug logs from production code

### Code Standards Compliance

- [ ] **Naming**: Files kebab-case, functions camelCase, types PascalCase
- [ ] **No `any` Types**: All TypeScript types are explicit
- [ ] **UI Components**: Checked existing components in `src/lib/components/ui/` before creating new ones
- [ ] **CSS**: Uses Tailwind or CSS modules (no inline styles)
- [ ] **Database**: Uses Drizzle ORM for all queries
- [ ] **Forms**: Uses arktype + superforms pattern
- [ ] **Error Handling**: Uses neverthrow Result pattern where applicable

### Testing & Verification

- [ ] Manual testing in dev mode (`bun run dev`)
- [ ] Responsive design tested (mobile view)
- [ ] Error cases handled gracefully
- [ ] No unhandled promise rejections
- [ ] All navigation links work correctly

### Git & Commits

- [ ] Code committed with conventional commit message
- [ ] Commit message follows format: `type(scope): description`
- [ ] No unrelated changes in commit
- [ ] Branch is clean: `git status` shows no uncommitted changes

### Full Quality Pipeline

Run this before submitting any work:

```bash
bun run check && bun run lint:fix && bun run format && git status
```

## Important Notes

- **Load Type**: Use `ServerLoad` not `PageServerLoad` for server-side data loading
- **Path Aliases**: Use `$lib` for imports from `src/lib/`, not relative paths
- **Database**: Never use raw SQL - always use Drizzle ORM for type safety
- **Secrets**: Never commit `.env` file or API keys
- **Dependencies**: Use `bun add` / `bun remove` for package management
- **Pre-commit**: ESLint + Prettier checks run automatically via lefthook
