# Project Structure

## Root Structure

```
src/
├── lib/
│   ├── auth/                  # Better Auth configuration
│   ├── components/            # Reusable UI components
│   │   └── ui/               # Base UI component library (bits-ui based)
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

## Database Schema

- **Users**: Extended with onboarding fields (dietary preferences, physical stats)
- **Recipes**: Full recipe data with nutrition and meal type classification
- **Authentication**: Better Auth tables (sessions, accounts, verification)
- **Additional**: Chat, favorites, preferences for future features

## Key Files

- `src/lib/server/db/schema.ts` - Database schema definitions
- `src/hooks.server.ts` - Authentication middleware
- `CLAUDE.md` - Project instructions and commands
- `drizzle.config.ts` - Database configuration
- `package.json` - Dependencies and scripts
