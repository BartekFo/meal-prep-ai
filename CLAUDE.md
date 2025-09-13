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

- `bun run db:start` - Start PostgreSQL database via Docker Compose
- `bun run db:push` - Push schema changes to database
- `bun run db:migrate` - Run database migrations
- `bun run db:generate` - Generate new migration files
- `bun run db:studio` - Open Drizzle Studio for database management

## Architecture Overview

### Technology Stack

- **Frontend**: SvelteKit 2.0 with TypeScript and Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with email/password
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

### File Uploads

- Recipe images stored in `uploads/recipes/[userId]/` directory
- Image upload handled by dedicated actions
- File paths stored as URLs in database

### Environment Variables

- `DATABASE_URL` - Required for database connection
- Database runs via Docker Compose for local development

- correct type for load is ServerLoad not PageServerLoad
