# Code Style and Conventions

## Code Formatting

- **Prettier Configuration**: Uses tabs, single quotes, no trailing commas, 100 char width
- **Auto-formatting**: Run `bun run format` after changes
- **Plugins**: prettier-plugin-svelte, prettier-plugin-tailwindcss

## Styling Guidelines

- **CSS Modules**: Always use CSS modules instead of inline style={{}}
- **Tailwind CSS**: Primary styling approach with utility classes
- **Component Library**: Custom UI components based on bits-ui
- **Always check existing components** in `src/lib/components/ui/` before creating new ones

## File Organization

- **Modules**: Feature-based organization in `src/lib/modules/`
- **Each module structure**: actions/, components/, db/queries.ts, schema/, index.ts
- **Routes**: SvelteKit file-based routing in `src/routes/`
- **UI Components**: Reusable components in `src/lib/components/ui/`

## TypeScript

- Strict TypeScript configuration
- arktype for runtime validation
- Type exports from schema files
- Use neverthrow for error handling with Result pattern

## Form Handling

- sveltekit-superforms for form validation
- formsnap for enhanced form components
- arktype schemas for validation
- Server actions in dedicated action files

## Naming Conventions

- **Files**: kebab-case for files and directories
- **Components**: PascalCase for Svelte components
- **Variables**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE
- **Database**: snake_case for database columns
