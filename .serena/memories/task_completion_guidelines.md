# Task Completion Guidelines

## Quality Checklist
Before marking a task as complete, ensure:

### Code Quality
- [ ] TypeScript: All type errors resolved (`bun run check`)
- [ ] Linting: ESLint passes (`bun run lint`)
- [ ] Formatting: Prettier formatted (`bun run format`)
- [ ] Svelte: Svelte check passes (part of `bun run check`)
- [ ] Unused Imports: All removed automatically by ESLint
- [ ] Console Logs: All debug logs removed from production code

### Code Standards
- [ ] Follows project naming conventions (camelCase, PascalCase, etc.)
- [ ] Uses existing UI components from `src/lib/components/ui/`
- [ ] Follows module organization pattern (if creating new module)
- [ ] Proper error handling with neverthrow Result pattern (if applicable)
- [ ] CSS: Uses CSS modules or Tailwind (no inline styles)
- [ ] Components: Props properly typed, no `any` types
- [ ] Database: Uses Drizzle ORM for all queries (if applicable)
- [ ] Forms: Uses arktype + superforms + formsnap (if applicable)

### Testing
- [ ] Manually tested in development (`bun run dev`)
- [ ] No TypeScript errors in dev mode
- [ ] Functionality works as expected
- [ ] Error cases handled gracefully
- [ ] Responsive design tested (mobile view with `bun run dev`)

### Git & Version Control
- [ ] Code committed with conventional commit message
- [ ] Relevant files staged and committed
- [ ] No unrelated changes included
- [ ] Branch is up to date with main (if applicable)

## Running Quality Checks

### Individual Commands
```bash
# Type checking and Svelte validation
bun run check

# Linting
bun run lint

# Auto-fix linting and formatting issues
bun run lint:fix

# Code formatting
bun run format

# All-in-one (check → lint → format)
bun run lint:fix && bun run check
```

### Full Quality Pipeline
For comprehensive quality assurance before submitting:
```bash
bun run check && bun run lint:fix && bun run format
```

## Database Changes
If modifying database schema:
- [ ] Schema updated in `src/lib/server/db/schema.ts`
- [ ] Migration generated: `bun run db:generate`
- [ ] Migration reviewed for correctness
- [ ] Migration applied: `bun run db:push` or `bun run db:migrate`
- [ ] Seed data updated if necessary: `bun run db:seed`
- [ ] Verify with Drizzle Studio: `bun run db:studio`

## Feature Implementation Checklist
When implementing new features:
- [ ] Create feature module in `src/lib/modules/[feature]/`
- [ ] Add validation schema in `schema/` folder
- [ ] Add database queries in `db/queries.ts` (if needed)
- [ ] Create server actions in `actions/` folder (if needed)
- [ ] Build components in `components/` folder
- [ ] Add routes in `src/routes/(authenticated)/[feature]/` (if needed)
- [ ] Update navigation/constants if needed
- [ ] Test authentication/authorization
- [ ] All quality checks pass

## Common Tasks Completion

### Adding New Component
```bash
# 1. Create component in appropriate location
# 2. Add TypeScript types
# 3. Run checks
bun run check
# 4. Format
bun run format
# 5. Test in dev server
bun run dev
```

### Adding New API Route
```bash
# 1. Create +server.ts file
# 2. Implement endpoint with proper types
# 3. Handle streaming/responses correctly
# 4. Run checks
bun run check && bun run lint:fix
# 5. Test with curl or browser
```

### Database Migration
```bash
# 1. Update schema.ts
bun run db:generate
# 2. Review migration file in drizzle/
# 3. Apply migration
bun run db:push
# 4. Verify in Drizzle Studio
bun run db:studio
```

### Fixing Linting Errors
```bash
# Auto-fix most ESLint issues
bun run lint:fix

# Then manually fix any remaining issues
bun run lint

# Format code
bun run format

# Verify
bun run check
```

## Pre-Commit Hooks
The project uses lefthook for pre-commit validation. It will:
- Run ESLint
- Run Prettier check
- Run TypeScript check
- Prevent commits if any check fails

## Review Workflow
1. Complete task implementation
2. Run full quality pipeline: `bun run check && bun run lint:fix && bun run format`
3. Test manually in dev server
4. Verify git status and commits
5. Submit for review

## Performance Expectations
- Build time: ~30-45 seconds for production build
- Type check time: ~10-15 seconds
- Lint time: ~5-10 seconds
- All checks combined: ~1-2 minutes

## Notes
- Never skip checks "just this once" - they ensure code quality
- If ESLint/Prettier conflicts occur, run `bun run lint:fix` first
- Always use `bun` not `npm` or `yarn` for consistency
- Keep node_modules clean: `rm -rf node_modules && bun install` if issues occur
- Use `bun run dev` frequently during development for immediate feedback
