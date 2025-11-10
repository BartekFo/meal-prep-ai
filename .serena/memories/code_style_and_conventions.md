# Code Style and Conventions

## TypeScript Standards
- **Strict Mode**: Enabled (`strict: true` in tsconfig)
- **Exact Optional Properties**: `exactOptionalPropertyTypes: true`
- **No Unchecked Index Access**: `noUncheckedIndexedAccess: true`
- **No Implicit Override**: `noImplicitOverride: true`
- **Isolated Modules**: `isolatedModules: true`
- **Verbatim Module Syntax**: `verbatimModuleSyntax: true`

## Naming Conventions
- **Files**: kebab-case for Svelte components and utility files
- **Functions**: camelCase
- **Classes/Types**: PascalCase
- **Constants**: camelCase or UPPER_CASE (for module constants)
- **Private Methods/Variables**: `_prefixed` or just camelCase
- **React/Svelte Components**: PascalCase (e.g., `AddRecipeForm.svelte`)
- **Exports**: Named exports preferred for modules, default export for page components

## Svelte/SvelteKit Conventions
- **Component Files**: `.svelte` extension
- **Script Context**: Use `<script lang="ts">` for TypeScript
- **Props**: Define with explicit types
- **Stores**: Use Svelte 5 `.svelte.ts` for reactive state
- **Hooks**: Use SvelteKit hooks (load, handle, etc.)
- **Layouts**: Use `+layout.svelte` for route layouts
- **Pages**: Use `+page.svelte` for routes
- **Server Routes**: Use `+server.ts` for API endpoints
- **Server Load**: `load` function type from `'@sveltejs/kit'` (NOT `PageServerLoad`)

## Component Architecture
- **UI Components**: Place in `src/lib/components/ui/`
- **Feature Components**: Place alongside their module
- **Props**: Be explicit with types, avoid `any`
- **Slots**: Document slot expectations
- **CSS Modules**: Preferred over inline styles (use `.css` or `<style>` blocks)
- **Tailwind**: Use Tailwind utility classes in markup

## Form Handling
- **Validation Schema**: Use arktype (not Zod)
- **Example**: `type RecipeForm = typeof schema.infer`
- **Server Actions**: Use dedicated action files in `actions/` folder
- **Form Component**: Use superforms with form data binding
- **Field Errors**: Use formsnap for enhanced form error display

## Database/ORM (Drizzle)
- **Schema Definition**: `src/lib/server/db/schema.ts`
- **Queries**: Organize in `module/db/queries.ts`
- **Type Safety**: Leverage Drizzle's type inference
- **JSON Fields**: Use `.json()` type for arrays, Drizzle handles stringification
- **Migrations**: Auto-generated, stored in `drizzle/` folder

## Error Handling
- **Pattern**: neverthrow Result type
- **Usage**: Return `ok(value)` or `err(error)` from functions
- **Handling**: Use `.match()`, `.isOk()`, `.isErr()` for control flow
- **Example**: Common in database queries and server actions

## API/Server Endpoints
- **Structure**: `src/routes/(authenticated)/api/[path]/+server.ts`
- **HTTP Methods**: Use appropriate methods (GET, POST, PUT, DELETE)
- **Streaming**: Use `TextEncoder` for streaming responses
- **CORS**: Handle if needed

## Authentication
- **Provider**: Better Auth with email/password
- **Session**: Managed via database
- **Protection**: Use `hooks.server.ts` middleware
- **Client**: Access via `authClient` from `$lib/auth`

## Imports
- **Path Aliases**: Use `$lib` for `src/lib/` imports
- **Style**: ES6 imports, no CommonJS
- **Organization**: Group imports (external → internal)
- **Unused Variables**: Prefix with `_` to suppress warnings

## CSS/Styling
- **Approach**: Tailwind CSS + CSS modules
- **Media Queries**: Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`)
- **Colors**: Use CSS custom properties defined in Tailwind config
- **Dark Mode**: Use `dark:` prefix for dark theme styles
- **Spacing**: Use Tailwind scale (4px base unit)

## Comments & Documentation
- **JSDoc**: Use for complex functions and modules
- **Inline Comments**: Use sparingly, prefer clear code
- **TODO Comments**: Mark with `// TODO:` for future work
- **Type Comments**: Use TSDoc syntax for complex types

## File Organization
- **Exports**: Use `index.ts` to centralize module exports
- **Imports**: Prefer named exports, organize logically
- **Module Barrel**: `index.ts` should export all public APIs
- **Circular Dependencies**: Avoid by proper module organization

## Special Rules
- **Button Component**: Uses `$derived` for resolve() - ESLint disabled for this file
- **Chat Messages**: Uses `@html` for marked markdown - ESLint disabled for this file
- **Unused Imports/Variables**: All removed, strict checking enabled
- **Navigation**: Don't use without resolve() in buttons (with exceptions)

## Code Quality Standards
- **Linting**: ESLint compliant, all errors must be fixed
- **Formatting**: Prettier formatted (auto-fixed on save)
- **Type Checking**: All TypeScript errors must be resolved
- **Svelte Check**: Must pass before committing
- **No Console Logs**: Remove debug console logs in production code

## Performance Considerations
- **Lazy Loading**: Use SvelteKit's lazy loading for routes
- **Images**: Use `@sveltejs/enhanced-img` for optimization
- **Caching**: Leverage SvelteKit's cache headers
- **Bundle Size**: Monitor and minimize dependencies
- **Reactive Statements**: Avoid expensive computations in reactive blocks

## Testing
- No formal test framework configured (can use Vitest if needed)
- Manual testing via `bun run dev`
- Database seeding via `bun run db:seed`

## Git Conventions
- **Branches**: Use descriptive names (feat/, fix/, refactor/, etc.)
- **Commits**: Follow conventional commits
- **Hooks**: Uses lefthook for pre-commit validation
