# Suggested Commands for Development

## Development Server

```bash
# Start development server with hot reload
bun run dev

# Preview production build locally
bun run preview
```

## Building & Deployment

```bash
# Build for production
bun run build

# Prepare for deployment (sync SvelteKit)
bun run prepare
```

## Quality Assurance

### Comprehensive Quality Check

```bash
# Run all checks in sequence: type checking, linting, formatting
bun run check && bun run lint:fix && bun run format

# OR individually:

# TypeScript and Svelte validation
bun run check

# Watch mode for continuous checking
bun run check:watch

# ESLint linting
bun run lint

# Auto-fix linting and formatting issues
bun run lint:fix

# Code formatting with Prettier
bun run format
```

## Database Management

### Database Operations

```bash
# Push schema changes to database
bun run db:push

# Run migrations
bun run db:migrate

# Generate new migration from schema changes
bun run db:generate

# Open Drizzle Studio (visual database explorer)
bun run db:studio

# Seed database with initial data
bun run db:seed

# Test SQLite migration
bun run db:test
```

## Common Development Workflows

### When Starting Development

```bash
bun install           # Install dependencies (if needed)
bun run dev          # Start dev server
# Open http://localhost:5173
```

### After Making Code Changes

```bash
# Check for type errors
bun run check

# View changes in dev server (hot reload happens automatically)
```

### Before Committing

```bash
# Run full quality pipeline
bun run check && bun run lint:fix && bun run format

# Verify changes
git status
git diff
```

### After Database Schema Changes

```bash
# Generate migration
bun run db:generate

# Review the migration file in drizzle/

# Apply the migration
bun run db:push

# Verify with Drizzle Studio
bun run db:studio

# Update seed if necessary
nano src/lib/server/db/seed.ts
bun run db:seed
```

### Working with Recipes

```bash
# Create a new recipe via UI: /recipes/new
# View recipes: /recipes
# Edit recipe: /recipes/[id]/edit
# Delete recipe: via recipe detail page

# Database interaction in dev:
bun run db:studio
```

### AI Chef Development

```bash
# Start dev server
bun run dev

# Navigate to /chef route
# Test chat functionality
# Monitor API calls in browser DevTools

# Check environment variable: GOOGLE_API_KEY
# Must be set in .env file
```

## Package Management

```bash
# Add a package
bun add [package-name]

# Add as dev dependency
bun add -d [package-name]

# Remove a package
bun remove [package-name]

# Update all packages
bun update

# Install dependencies (after pulling changes)
bun install
```

## Useful Git Commands

```bash
# Check status
git status

# View changes
git diff

# Stage changes
git add [file]

# Commit with conventional commit message
git commit -m "feat: description"

# View log
git log --oneline -10
```

## System Commands (Linux)

```bash
# List files
ls -la

# Show directory structure
tree src/lib/modules

# Find files
find . -name "*.svelte" -type f

# Search in files
grep -r "function_name" src/

# View file contents
cat src/lib/components/ui/button/button.svelte

# Create directory
mkdir -p src/lib/modules/new-feature

# Remove files/directories
rm -rf build/
```

## Debugging

### Development Mode Debugging

```bash
# Start dev server (includes source maps)
bun run dev

# Open browser DevTools (F12 or Cmd+Option+I)
# Check Console for errors
# Check Network tab for API calls
```

### TypeScript Errors

```bash
# See all TypeScript errors
bun run check

# Detailed error messages appear in editor and terminal
```

### Database Debugging

```bash
# Visual exploration
bun run db:studio

# Check database file size (SQLite)
du -h data/db.sqlite

# Backup database
cp data/db.sqlite data/db.sqlite.backup
```

## Performance Monitoring

### Build Performance

```bash
# Build in production mode (slow but optimized)
bun run build

# Check build output size
du -sh build/

# Time the build
time bun run build
```

### Type Check Performance

```bash
# Time type checking
time bun run check

# Watch for changes (quicker feedback)
bun run check:watch
```

## Environment Setup

```bash
# View environment variables (if .env file exists)
cat .env

# Set up .env for development
cp .env.example .env

# Edit environment variables
nano .env

# Required for AI features:
# GOOGLE_API_KEY=your_api_key
# DATABASE_URL=file:./data/db.sqlite
```

## Cleanup & Maintenance

```bash
# Remove build artifacts
rm -rf build/ .svelte-kit/ dist/

# Clean node_modules and reinstall
rm -rf node_modules/ && bun install

# Remove development database
rm data/db.sqlite data/db.sqlite-wal data/db.sqlite-shm

# View disk usage
du -sh . # Current directory
du -sh ./* # All items in current directory
```

## Documentation & Help

```bash
# View TypeScript configuration
cat tsconfig.json

# View ESLint configuration
cat eslint.config.js

# View Vite configuration
cat vite.config.ts

# View Svelte configuration
cat svelte.config.js

# View Drizzle configuration
cat drizzle.config.ts

# View project guidance (this file)
cat .claude/CLAUDE.md
```

## Quick Reference Aliases

Consider adding these to your shell profile:

```bash
alias br='bun run'
alias bdev='bun run dev'
alias bbuild='bun run build'
alias bcheck='bun run check'
alias blint='bun run lint:fix'
alias bdb='bun run db:studio'
```

Then you can use: `bdev`, `bcheck`, `blint`, etc.

## Notes

- Always use `bun` instead of `npm` or `yarn` for consistency
- Development server auto-reloads on file changes (hot module replacement)
- TypeScript errors prevent build but not dev server
- ESLint can auto-fix most issues with `bun run lint:fix`
- Database changes require migrations: generate → review → push
- Keep `.env` file in `.gitignore` - never commit secrets
