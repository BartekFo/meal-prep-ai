# Codebase Structure

## Root Level Organization

```
/
├── .claude/              # Claude Code configuration (CLAUDE.md)
├── .specify/             # Specification workflow scripts
├── src/                  # Source code
├── drizzle/              # Database migrations
├── scripts/              # Utility scripts
├── data/                 # Local database storage
├── uploads/              # User-uploaded files (recipes)
├── build/                # Build output
├── static/               # Static assets
├── deployment/           # Deployment configs (systemd, docker)
└── [config files]        # tsconfig, eslint, prettier, vite, etc.
```

## Source Directory Structure

### src/lib/ - Shared Libraries

- **auth/** - Better Auth configuration and client setup
- **components/**
  - **ui/** - 30+ reusable UI components (shadcn-inspired)
    - button, card, input, select, dialog, dropdown-menu
    - forms, tooltips, skeleton loaders, etc.
  - **app-sidebar.svelte** - Main app navigation
  - **app-logo.svelte** - Logo component
  - **mode-toggle.svelte** - Dark mode toggle
  - **site-header.svelte** - Header component
  - **nav-main.svelte** - Main navigation
  - **nav-user.svelte** - User menu
- **constants/**
  - **routes.ts** - App route constants
  - **meal-types.ts** - Meal classification constants
- **hooks/**
  - **auth-handler.ts** - Auth middleware
  - **is-mobile.svelte.ts** - Mobile detection
- **modules/** - Feature-based modules
  - **auth/** - Authentication (signin, signup)
  - **onboarding/** - User onboarding flow
  - **recipes/** - Recipe CRUD and display
    - **new/** - Recipe creation with form validation
    - **edit/** - Recipe editing
    - **chat/** - Recipe chat integration
    - **components/** - Recipe-specific UI components
  - **chef/** - AI Chef chat assistant
    - **components/** - Chat UI (messages, input, history)
- **server/**
  - **db/**
    - **schema.ts** - Drizzle ORM schema definitions
    - **index.ts** - Database connection setup
    - **queries.ts** - Database utility functions
    - **seed.ts** - Database seeding script
- **types/**
  - **auth.ts** - Authentication types
  - **onboarding.ts** - Onboarding types
- **utils/** - Utility functions
  - **onboarding.ts** - Onboarding helpers
  - **utils.ts** - General utilities
- **storage.ts** - Client-side storage management

### src/routes/ - SvelteKit File-Based Routing

- **(auth)/** - Public auth pages
  - **signin/** - Login page
  - **signup/** - Registration page
- **(authenticated)/** - Protected pages (require auth)
  - **dashboard/** - Main dashboard
  - **recipes/** - Recipe listing and management
  - **chef/** - AI Chef chat interface
  - **profile/** - User profile settings
  - **api/**
    - **chat/+server.ts** - Streaming chat endpoint
    - Other API endpoints
- **onboarding/** - Onboarding flow pages
- **+layout.svelte** - Root layout
- **+page.svelte** - Home page

### Database Schema (Drizzle ORM)

- **users** - Extended with onboarding fields
- **recipes** - Full recipe with nutrition data
- **better_auth_account** - Authentication accounts
- **better_auth_session** - User sessions
- **better_auth_verification** - Email verification
- **chat** - AI chat messages (planned)
- **chat_messages** - Chat history

### Uploads Directory

```
uploads/
└── recipes/
    └── [userId]/
        └── [recipeId]-[fileName]
```

## Module Structure Pattern

Each feature module follows this consistent structure:

```
module/
├── actions/
│   ├── action-name.ts      # Server actions
│   └── index.ts            # Action exports
├── components/
│   ├── Component.svelte     # Feature components
│   └── index.ts            # Component exports
├── db/
│   └── queries.ts          # Database queries
├── schema/
│   └── validation.ts       # arktype schemas
├── index.ts                # Module exports
└── types.ts               # Module types (if needed)
```

## Key Files

- **src/app.html** - HTML template
- **src/hooks.server.ts** - Server-side hooks (auth middleware)
- **src/app.css** - Global styles + Tailwind imports
- **src/prose.css** - Markdown prose styles
- **svelte.config.js** - SvelteKit configuration
- **vite.config.ts** - Vite build configuration
- **drizzle.config.ts** - Database migration config
- **eslint.config.js** - Linting rules

## Database Connection

- Single SQLite file (`file:/path/to/db.sqlite`)
- WAL mode enabled for concurrent operations
- Connection pool with ~160MB page cache
- Automatic hourly checkpoint

## Important Notes

- No separate backend server - everything is SSR via SvelteKit
- File uploads go to `uploads/` directory on server
- Database is single SQLite file, not Docker-based
- Better Auth handles all authentication state management
- Drizzle provides type-safe database access
