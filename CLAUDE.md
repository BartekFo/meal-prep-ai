# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run check` - Run TypeScript and Svelte checks
- `bun run format` - Format code with Prettier
- `bun run lint` - Run ESLint

### Database Commands

- `bun run db:push` - Push schema changes to SQLite database
- `bun run db:migrate` - Run database migrations
- `bun run db:generate` - Generate new migration files
- `bun run db:studio` - Open Drizzle Studio for database management

**Note:** Database is a single SQLite file specified by `DATABASE_URL` environment variable (format: `file:/path/to/db.sqlite`). No Docker required.

## Architecture Overview

### Technology Stack

- **Frontend**: SvelteKit 2.0 with TypeScript and Tailwind CSS
- **Database**: SQLite with Drizzle ORM and Bun's native sqlite driver
- **Authentication**: Better Auth with email/password and Drizzle adapter
- **UI Components**: Custom UI components based on bits-ui library
- **Styling**: CSS modules (prefer over inline styles)
- **Package Manager**: Bun

### Project Structure

```
src/
├── lib/
│   ├── auth/                  # Better Auth configuration
│   ├── components/            # Reusable UI components
│   │   └── ui/               # Base UI component library
│   ├── constants/            # App constants (routes, meal types)
│   ├── hooks/                # Svelte hooks and utilities
│   ├── modules/              # Feature-based modules
│   │   ├── auth/             # Authentication module
│   │   ├── onboarding/       # User onboarding flow
│   │   └── recipes/          # Recipe management
│   └── server/
│       └── db/               # Database configuration and schema
├── routes/                   # SvelteKit file-based routing
│   ├── (auth)/              # Authentication pages
│   ├── (authenticated)/     # Protected pages
│   └── onboarding/          # Onboarding flow
└── uploads/                 # File upload storage
```

### Database Schema

- **Users**: Extended with onboarding fields (dietary preferences, physical stats)
- **Recipes**: Full recipe data with nutrition information and meal type classification
- **Authentication**: Better Auth tables for sessions, accounts, verification
- **Additional**: Chat, favorites, preferences for future features

### Key Architectural Patterns

#### Module Organization

Each feature module follows this structure:

- `actions/` - Server-side actions and API calls
- `components/` - Feature-specific Svelte components
- `db/queries.ts` - Database queries for the module
- `schema/` - Validation schemas (using arktype)
- `index.ts` - Module exports

#### Authentication Flow

- Uses Better Auth with Drizzle adapter
- Extended user model with onboarding fields
- Authenticated routes protected by auth handler in `hooks.server.ts`
- Session management with database persistence

#### Form Handling

- Uses sveltekit-superforms for form validation
- arktype for runtime type validation
- formsnap for enhanced form components
- Server actions in dedicated action files

#### Error Handling

- Uses neverthrow library for Result pattern
- Consistent error handling in database operations
- Server actions return success/error objects

### UI Component Guidelines

- Always check existing components in `src/lib/components/ui/` before creating new ones
- Use CSS modules instead of inline styles
- Follow existing component patterns for consistency
- Base components built on bits-ui library

### Database Development

- Use Drizzle ORM for all database operations
- Database schema defined in `src/lib/server/db/schema.ts`
- Generate migrations with `bun run db:generate` after schema changes
- Use `bun run db:studio` to inspect database during development

#### SQLite-Specific Notes

- Database connection configured in `src/lib/server/db/index.ts` with production-ready PRAGMA settings
- WAL mode enabled for concurrent read/write operations
- Automatic hourly checkpoint for WAL cleanup
- Single-file database makes backups trivial (just copy the file)
- JSON storage for array fields (Drizzle handles parsing/stringifying automatically with `$type<T[]>()`)
- Better Auth adapter configured with `provider: 'sqlite'`

### File Uploads

- Recipe images stored in `uploads/recipes/[userId]/` directory
- Image upload handled by dedicated actions
- File paths stored as URLs in database

### Environment Variables

- `DATABASE_URL` - Required for database connection (format: `file:/path/to/db.sqlite`)
  - Example: `DATABASE_URL=file:./data/db.sqlite` (development)
  - Example: `DATABASE_URL=file:/var/lib/meal-prep-ai/db.sqlite` (production)

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

### Notes

- correct type for load is ServerLoad not PageServerLoad
