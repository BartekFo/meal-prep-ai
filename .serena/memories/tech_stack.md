# Technology Stack Details

## Runtime & Package Manager

- **Bun 1.0+**: TypeScript-first JavaScript runtime with bundled package manager
  - Native sqlite driver (better-sqlite3)
  - TypeScript support out of the box
  - Much faster than Node.js for development

## Frontend Framework

- **SvelteKit 2.37.0**: Meta-framework for Svelte
  - File-based routing (`src/routes/`)
  - Server-side rendering (SSR) by default
  - Built on Vite for fast development
  - Adapter: Node (for production deployment)
- **Svelte 5.38.6**: Reactive JavaScript framework
  - Runes system (`$state`, `$derived`, `$effect`)
  - Component-driven architecture
  - Compiler-optimized (no runtime overhead)
  - Svelte 5 features: snippets, rune-based reactivity

## Styling

- **Tailwind CSS 4.1.12**: Utility-first CSS framework
  - CSS Functions and Mixins
  - Dark mode support
  - Responsive design (mobile-first)
  - Plugins: @tailwindcss/typography, prettier-plugin-tailwindcss

- **CSS Modules**: For component-scoped styles
  - Avoids CSS conflicts
  - Can be imported in Svelte components
  - Alternative to Tailwind for complex styles

## UI Component Library

- **bits-ui 2.11.0**: Headless UI components
  - Accessibility-first design
  - Unstyled and customizable
  - Built on latest web standards
  - Foundation for custom shadcn-style components

- **Custom UI Components**: Built on bits-ui
  - 30+ reusable components
  - Located in `src/lib/components/ui/`
  - Tailwind-styled with dark mode support

## Database

- **SQLite**: Lightweight, file-based relational database
  - Single file (`data/db.sqlite`)
  - WAL mode for concurrent operations
  - Zero external dependencies
  - Perfect for single-server deployments

- **Drizzle ORM 0.44.5**: Type-safe SQL query builder
  - Full TypeScript support
  - Zero-runtime overhead (compiles to SQL)
  - Migrations system
  - Works with SQLite, PostgreSQL, MySQL

- **Drizzle Kit 0.31.4**: Companion tool for Drizzle
  - Migration generation
  - Database introspection
  - Drizzle Studio (visual explorer)

## Authentication

- **Better Auth 1.3.7**: Modern authentication library
  - Email/password authentication
  - Drizzle ORM adapter
  - Session management via database
  - Extensible plugin system
  - Built-in security features

## Forms & Validation

- **sveltekit-superforms 2.27.1**: Form state management
  - Server-side validation
  - Client-side synchronization
  - Built-in error handling
  - Works with any validation library

- **arktype 2.1.20**: Runtime type validation
  - Type-safe validation schemas
  - Better error messages than Zod
  - Lightweight alternative to Zod
  - Recursive type support

- **formsnap 2.0.1**: Enhanced form components
  - Svelte form field helpers
  - Integrates with superforms
  - Accessible form patterns

## AI/LLM Integration

- **Vercel AI SDK 5.0.80**: Provider-agnostic AI library
  - Streaming support
  - Provider: Google Gemini
  - React/Svelte hooks for UI integration

- **@ai-sdk/google 2.0.23**: Google AI provider
  - Google Gemini models
  - Streaming responses
  - Function calling support

- **@ai-sdk/svelte 3.0.80**: Svelte hooks for AI SDK
  - `useChat()` hook for chat interfaces
  - Streaming message handling
  - Loading states

- **mem0ai 2.1.38**: Persistent AI memory
  - Long-term conversation memory
  - User-specific memory storage
  - Conversation context preservation

## Error Handling

- **neverthrow 8.2.0**: Result pattern implementation
  - Type-safe error handling
  - `Result<T, E>` type
  - Composable error chains
  - ESLint plugin included

## Development Tools

- **Vite 7.1.3**: Next-generation frontend build tool
  - Lightning-fast HMR (hot module replacement)
  - ES module-based development
  - Production-optimized builds

- **TypeScript 5.9.2**: Superset of JavaScript with types
  - Strict mode enabled
  - Type inference
  - Advanced type features

- **ESLint 9.36.0**: JavaScript linter
  - typescript-eslint for TypeScript support
  - svelte plugin for Svelte files
  - Prettier integration

- **Prettier 3.6.2**: Code formatter
  - Consistent code style
  - Plugins: svelte, tailwindcss
  - Enforced on commits (via lefthook)

- **svelte-check 4.3.1**: Svelte type checker
  - Validates component types
  - Integrates with TypeScript
  - Part of `bun run check` command

## Testing (Not yet configured)

- Can be added with: Vitest, Playwright, Cypress
- Currently manual testing via `bun run dev`

## Other Dependencies

- **@lucide/svelte 0.544.0**: Icon library
  - 544+ icons
  - Customizable size/color
  - SVG-based

- **marked 16.4.1**: Markdown parser
  - Converts markdown to HTML
  - Used for recipe descriptions, chat messages
  - Sanitization available

- **clsx 2.1.1**: Utility for conditional classnames
  - Similar to classnames
  - Works with Tailwind
  - Type-safe

- **tailwind-merge 3.3.1**: Merge Tailwind class conflicts
  - Resolves competing Tailwind classes
  - Prevents class duplication

- **tailwind-variants 1.0.0**: Variants pattern for Tailwind
  - Component variant definitions
  - Type-safe style compositions

- **mode-watcher 1.1.0**: Dark mode management
  - System preference detection
  - Theme persistence
  - Svelte integration

- **@sveltejs/enhanced-img 0.8.1**: Image optimization
  - Responsive images
  - WebP/AVIF support
  - Lazy loading

- **@internationalized/date 3.9.0**: Date utilities
  - Internationalization support
  - Calendar calculations

## Development Environment

- **Node Version**: Managed by Bun
- **Package Lock**: `bun.lock` (Bun's lock file)
- **NPM Config**: `.npmrc` (registry configuration)

## Build Configuration Files

- `tsconfig.json` - TypeScript compiler options
- `svelte.config.js` - SvelteKit configuration
- `vite.config.ts` - Vite build configuration
- `drizzle.config.ts` - Database migration configuration
- `eslint.config.js` - ESLint rules
- `.prettierrc` - Prettier formatting rules
- `tailwind.config.js` - Tailwind theme/plugins

## Production Deployment Stack

- **Hosting**: Can run on any Node.js host
- **Database**: SQLite file (portable, backupable)
- **Process Manager**: Systemd service (provided)
- **Container**: Docker support (Dockerfile provided)
- **Environment**: Requires `DATABASE_URL` and `GOOGLE_API_KEY`

## API Endpoints

- Chat streaming endpoint: `POST /api/chat`
- Uses Server-Sent Events (SSE) for streaming
- No REST API for recipes (form-based updates)

## Environment Variables (Required)

- `DATABASE_URL`: SQLite database path (e.g., `file:./data/db.sqlite`)
- `GOOGLE_API_KEY`: Google Gemini API key (for AI features)

## Ports

- Development: `http://localhost:5173` (Vite default)
- Build preview: `http://localhost:4173` (via `bun run preview`)

## Browser Support

- Modern browsers with ES2020+ support
- Svelte 5 requires modern JavaScript
- Mobile browsers fully supported (responsive design)
