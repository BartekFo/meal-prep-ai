<!--
SYNC IMPACT REPORT
==================
Version Change: NONE → 1.0.0 (Initial Constitution)
Modified Principles: N/A (First version)
Added Sections:
  - Core Principles (6 principles)
  - Technology Constraints
  - Development Workflow
  - Governance
Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section aligned
  ✅ spec-template.md - Requirements structure aligned
  ✅ tasks-template.md - Task categorization aligned
Follow-up TODOs: None
-->

# Meal Prep AI Constitution

## Core Principles

### I. Module-First Architecture

Every feature MUST be organized as a self-contained module within `src/lib/modules/[feature]/`:

- **Structure**: Each module MUST include `actions/`, `components/`, `db/queries.ts`, `schema/`, and `index.ts`
- **Separation**: Business logic in actions/queries, validation in schemas, UI in components
- **Exports**: Module public API MUST be exposed through `index.ts`

**Rationale**: Modular organization enables independent development, testing, and maintenance of features. Clear boundaries prevent coupling and make the codebase navigable.

### II. Type Safety & Validation

All data crossing boundaries MUST be validated:

- **Runtime Validation**: Use arktype for schema definitions (NO Zod, NO Yup)
- **Type Inference**: Derive TypeScript types from arktype schemas, not vice versa
- **Form Handling**: Use sveltekit-superforms with formsnap for all form submissions
- **Error Handling**: Use neverthrow Result pattern for operations that can fail

**Rationale**: Runtime validation prevents invalid data from entering the system. Type inference from runtime schemas ensures single source of truth and eliminates type/runtime mismatches.

### III. Database-First Design

Database schema is the source of truth:

- **ORM**: Drizzle ORM exclusively (NO Prisma, NO TypeORM)
- **Schema Location**: All tables defined in `src/lib/server/db/schema.ts`
- **Migrations**: Generate migrations via `bun run db:generate` before any schema changes go to production
- **Queries**: Module-specific queries in `[module]/db/queries.ts`, NOT in actions or components
- **Result Pattern**: All database operations MUST return neverthrow Results

**Rationale**: Centralized schema prevents drift. Migration-first workflow ensures database changes are versioned and auditable. Query separation enables reuse and testing.

### IV. Authentication & Authorization

Security is non-negotiable:

- **Library**: Better Auth with Drizzle adapter (NO custom auth, NO Auth.js)
- **Session Management**: Database-persisted sessions with IP and user-agent tracking
- **Route Protection**: All authenticated routes protected via `hooks.server.ts`
- **User Model**: Extended user model in schema.ts for onboarding and preferences
- **Password Handling**: MUST use Better Auth's built-in password hashing (NO manual bcrypt)

**Rationale**: Better Auth provides production-ready security patterns. Database sessions enable device management and security auditing. Centralized protection prevents auth bypass vulnerabilities.

### V. Component Reusability

UI components follow strict hierarchy:

- **Base Components**: `src/lib/components/ui/` built on bits-ui (headless primitives)
- **Check First**: ALWAYS verify existing components before creating new ones
- **Styling**: CSS modules preferred over inline styles for maintainability
- **Composition**: Build complex components by composing base components
- **No Duplication**: If logic exists in a component, reuse it; do NOT copy-paste

**Rationale**: Reusable components reduce maintenance burden, ensure consistency, and accelerate development. bits-ui provides accessible foundations that meet WCAG standards.

### VI. Linting & Formatting Standards

Code quality is enforced automatically:

- **Primary Tool**: Biome via ultracite for formatting and linting (subsecond performance)
- **Secondary**: ESLint for Svelte-specific rules only
- **Prettier**: For Svelte component formatting only
- **Pre-commit**: All checks MUST pass before commit (enforced via lefthook)
- **No Exceptions**: Code that doesn't pass linting MUST NOT be committed

**Rationale**: Automated enforcement prevents bikeshedding and maintains consistency. Biome's speed enables instant feedback. Separation of concerns (Biome for TS/JS, ESLint for Svelte) avoids tool conflicts.

## Technology Constraints

These technology choices are constitutional and MUST NOT be changed without amending this document:

- **Runtime**: Bun (package manager and runtime)
- **Framework**: SvelteKit 2.0+ with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: arktype (NOT Zod, Yup, or others)
- **Auth**: Better Auth with Drizzle adapter
- **Forms**: sveltekit-superforms + formsnap
- **Error Handling**: neverthrow Result pattern
- **UI Primitives**: bits-ui for accessible headless components
- **Styling**: Tailwind CSS 4+ with CSS modules for component-specific styles
- **Linting**: Biome (ultracite) + ESLint for Svelte

**Rationale**: Consistency in technology choices reduces cognitive load, enables knowledge sharing, and prevents integration issues. These tools are chosen for performance (Bun, Biome), type safety (arktype, neverthrow), and accessibility (bits-ui).

## Development Workflow

### Code Review Requirements

All code changes MUST:

1. Pass all linting and formatting checks locally
2. Include validation schemas for any data input
3. Use neverthrow Results for error-prone operations
4. Follow module structure for new features
5. Reuse existing components before creating new ones

### Testing Strategy

- **Manual Testing**: Current approach until test infrastructure is established
- **Database Testing**: Use `bun run db:studio` to inspect data changes
- **Type Checking**: `bun run check` MUST pass before commits
- **Future**: TDD principles apply when test infrastructure is added

### Git Workflow

- **Branch Naming**: `feature/[feature-name]`, `fix/[bug-name]`, `refactor/[scope]`
- **Commits**: Atomic commits with descriptive messages
- **Pre-commit Hooks**: Enforced via lefthook - all checks MUST pass
- **Main Branch**: `main` is the primary branch for all PRs

## Governance

### Amendment Process

This constitution can be amended via:

1. Proposal in GitHub issue or PR description
2. Team discussion and consensus
3. Documentation of rationale for change
4. Update of this document with version bump
5. Migration plan for breaking changes (if applicable)

### Versioning Policy

Constitution version follows semantic versioning:

- **MAJOR**: Backward-incompatible changes (e.g., technology stack changes)
- **MINOR**: New principles or constraints added
- **PATCH**: Clarifications, wording improvements, non-semantic changes

### Compliance

- All features MUST comply with these principles
- PRs violating principles MUST justify exceptions or amend constitution
- Regular reviews of adherence during code review
- Architecture decisions MUST reference relevant principles

### Runtime Guidance

For detailed development guidance, see:

- **CLAUDE.md**: AI assistant development instructions
- **README.md**: Project setup and common tasks
- **package.json**: Available npm/bun scripts

**Version**: 1.0.0 | **Ratified**: 2025-10-20 | **Last Amended**: 2025-10-20
