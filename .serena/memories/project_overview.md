# Meal Prep AI - Project Overview

## Project Purpose
Meal Prep AI is a web application for meal planning and recipe management with AI-powered chef assistant. It helps users track recipes, manage meal preferences, and get personalized meal planning recommendations.

## Key Features
- User authentication and onboarding with dietary preferences
- Recipe management (create, edit, view, delete recipes)
- AI Chef assistant powered by Google's AI SDK for recipe recommendations
- Meal meal type classification and filtering
- Recipe nutrition tracking
- User profile and settings management
- Chat history for AI interactions

## Technology Stack

### Frontend
- **Framework**: SvelteKit 2.0 (Node adapter compatible)
- **Language**: TypeScript 5.9.2
- **Styling**: Tailwind CSS 4.1.12 + CSS modules
- **UI Components**: Custom components based on bits-ui 2.11.0
- **Forms**: sveltekit-superforms 2.27.1 + formsnap 2.0.1 + arktype 2.1.20
- **AI Integration**: Vercel AI SDK 5.0.80 (@ai-sdk/google, @ai-sdk/svelte)
- **Icon Library**: @lucide/svelte 0.544.0
- **Icons & Colors**: shadcn-inspired custom UI components

### Backend
- **Runtime**: Bun (package manager and runtime)
- **Database**: SQLite with Drizzle ORM 0.44.5
- **Authentication**: Better Auth 1.3.7 with Drizzle adapter
- **Error Handling**: neverthrow 8.2.0 (Result pattern)
- **AI Memory**: mem0ai 2.1.38 (persistent memory for AI)
- **Markdown**: marked 16.4.1

### Development Tools
- **Build**: Vite 7.1.3
- **Type Checking**: TypeScript, svelte-check 4.3.1
- **Linting**: ESLint 9.36.0 + typescript-eslint
- **Formatting**: Prettier 3.6.2 with svelte and tailwind plugins
- **Database Toolkit**: Drizzle Kit 0.31.4
- **Version Control Hooks**: lefthook 1.12.3
- **Theme**: mode-watcher 1.1.0 (dark mode support)

## Project Statistics
- **Language**: TypeScript (strict mode enabled)
- **Total Dependencies**: ~30+ direct dependencies
- **Components**: 80+ UI components in component library
- **Modules**: 5 main feature modules (auth, onboarding, recipes, chef, components)
- **Database Tables**: Users, Recipes, Chat, Authentication (Better Auth), Accounts, Sessions, Verification

## Key Standards & Patterns
- **Module Organization**: Features are organized in feature-based modules with consistent structure
- **Error Handling**: Uses neverthrow Result pattern for all database operations
- **Type Safety**: Strict TypeScript with full type checking enabled
- **Form Validation**: arktype for runtime validation + superforms for form handling
- **Database**: SQLite with WAL mode for concurrent operations
- **Code Style**: Prettier formatted, ESLint compliant, unused variable detection
- **CSS**: Prefer CSS modules over inline styles, Tailwind utilities in markup

## Recent Development
- AI Chef chat functionality with streaming responses
- mem0ai integration for persistent conversation memory
- Recipe management improvements
- Chat history management and sidebar
- Thinking indicator for long-running AI operations
