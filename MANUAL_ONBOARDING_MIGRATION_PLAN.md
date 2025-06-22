# Manual Onboarding Migration Plan: Next.js → Svelte

## Overview

This document outlines the step-by-step migration of the **manual onboarding flow only** from the Next.js app (`meal-preping-ai/`) to the Svelte app (`meal-prep-ai/`), following the existing modules pattern.

## Current Manual Onboarding Structure Analysis

### Components to Migrate

- **Layout**: Header with logo and logout button
- **Manual Onboarding** (3 steps):
  - Step 1: Personal info (name, avatar, DOB, gender, activity level, weight goal)
  - Step 2: Dietary preferences selection
  - Step 3: Disliked ingredients
- **Supporting Components**: Avatar upload, form fields, progress indicator

### Technical Stack Changes

- **From**: Next.js + TanStack Form + Valibot + Supabase
- **To**: SvelteKit + Superforms + Arktype + Drizzle + PostgreSQL

### Module Structure

Following existing pattern: `src/lib/modules/onboarding/`

## Migration Steps

### Phase 1: Foundation Setup (Days 1-2)

#### Step 1.1: Setup Module Structure

```bash
# Create onboarding module following existing pattern
mkdir -p src/lib/modules/onboarding/components
mkdir -p src/lib/modules/onboarding/db
mkdir -p src/lib/modules/onboarding/schema
mkdir -p src/lib/modules/onboarding/actions

# Create route structure
mkdir -p src/routes/onboarding/manual/step-2
mkdir -p src/routes/onboarding/manual/step-3
```

#### Step 1.2: Install Missing shadcn Components

```bash
# Install missing shadcn components needed for onboarding
npx shadcn-svelte@latest add calendar
npx shadcn-svelte@latest add popover
npx shadcn-svelte@latest add radio-group
npx shadcn-svelte@latest add progress
```

Required components:

- **calendar** - Date of birth selection
- **popover** - Date picker wrapper
- **radio-group** - Activity level & weight goal selection
- **progress** - Step progress indicator

#### Step 1.3: Create Base Layout

Create `src/routes/onboarding/+layout.svelte`:

- Header with app logo
- Logout functionality
- Base styling structure

#### Step 1.4: Database Schema Setup

Create `src/lib/modules/onboarding/db/schema.ts`:

- User onboarding fields schema
- Dietary options table schema
- Migration helpers

### Phase 2: Core Module Components (Days 3-4)

#### Step 2.1: Create Module Components

Create in `src/lib/modules/onboarding/components/`:

- `ProgressBar.svelte` - Step progress indicator
- `AvatarUpload.svelte` - File upload with preview
- `DietaryOption.svelte` - Checkbox card component
- `PersonalInfoForm.svelte` - Step 1 form
- `DietaryPreferencesForm.svelte` - Step 2 form
- `IngredientsForm.svelte` - Step 3 form

#### Step 2.2: Validation Schemas

Create `src/lib/modules/onboarding/schema/`:

- `personal-info.ts` - Step 1 validation (arktype)
- `dietary-preferences.ts` - Step 2 validation (arktype)
- `ingredients.ts` - Step 3 validation (arktype)
- `index.ts` - Export all schemas

#### Step 2.3: Database Actions

Create `src/lib/modules/onboarding/db/`:

- `queries.ts` - Database query functions
- `mutations.ts` - Database mutation functions
- `types.ts` - TypeScript types for DB operations

#### Step 2.4: Server Actions

Create `src/lib/modules/onboarding/actions/`:

- `personal-info.ts` - Save personal information
- `dietary-preferences.ts` - Save dietary preferences
- `ingredients.ts` - Save disliked ingredients
- `image-upload.ts` - Handle avatar uploads

### Phase 3: Manual Onboarding Implementation (Days 5-6)

#### Step 3.1: Step 1 - Personal Information

Create `src/routes/onboarding/manual/+page.svelte`:

- Import PersonalInfoForm from module
- Progress indicator (1 of 3)
- Form submission handling

Create `src/routes/onboarding/manual/+page.server.ts`:

- Load action using module functions
- Form validation with arktype
- Database save using module mutations

#### Step 3.2: Step 2 - Dietary Preferences

Create `src/routes/onboarding/manual/step-2/+page.svelte`:

- Import DietaryPreferencesForm from module
- Progress indicator (2 of 3)
- Multi-select functionality

Create `src/routes/onboarding/manual/step-2/+page.server.ts`:

- Load dietary options from DB
- Form actions for saving preferences
- Navigation to step 3

#### Step 3.3: Step 3 - Disliked Ingredients

Create `src/routes/onboarding/manual/step-3/+page.svelte`:

- Import IngredientsForm from module
- Progress indicator (3 of 3)
- Dynamic ingredient management
- Complete onboarding button

Create `src/routes/onboarding/manual/step-3/+page.server.ts`:

- Save ingredients using module actions
- Complete onboarding flow
- Redirect to dashboard

### Phase 4: Integration & Polish (Days 7-8)

#### Step 4.1: Navigation & State Management

- Implement step-by-step navigation
- Handle browser back/forward
- Progress persistence between steps
- Prevent step skipping

#### Step 4.2: Database Integration

- Create migration files in `drizzle/`
- Test all CRUD operations
- Handle image upload to file system
- Error handling and recovery

#### Step 4.3: UI/UX Polish

- Responsive design for all steps
- Loading states during submissions
- Form validation error messages
- Success feedback and transitions

### Phase 5: Testing & Deployment (Day 9)

#### Step 5.1: Testing

- Unit tests for module components
- Integration tests for form flows
- Database operation tests
- Navigation flow tests

#### Step 5.2: Migration & Cleanup

- Run database migrations
- Test complete onboarding flow
- Performance optimization
- Documentation updates

## Technical Implementation Details

### Module Structure Example

```
src/lib/modules/onboarding/
├── components/
│   ├── ProgressBar.svelte
│   ├── AvatarUpload.svelte
│   ├── PersonalInfoForm.svelte
│   ├── DietaryPreferencesForm.svelte
│   └── IngredientsForm.svelte
├── schema/
│   ├── personal-info.ts
│   ├── dietary-preferences.ts
│   ├── ingredients.ts
│   └── index.ts
├── db/
│   ├── schema.ts
│   ├── queries.ts
│   ├── mutations.ts
│   └── types.ts
├── actions/
│   ├── personal-info.ts
│   ├── dietary-preferences.ts
│   ├── ingredients.ts
│   └── image-upload.ts
└── index.ts
```

### Form Handling with Arktype

```typescript
// src/lib/modules/onboarding/schema/personal-info.ts
import { type } from 'arktype';

export const personalInfoSchema = type({
	firstName: 'string',
	lastName: 'string',
	avatar: 'File|undefined',
	dateOfBirth: 'string|undefined',
	gender: 'string|undefined',
	activityLevel: 'string',
	weightGoal: 'string'
});

export type PersonalInfo = typeof personalInfoSchema.infer;
```

### Server Actions Pattern

```typescript
// src/lib/modules/onboarding/actions/personal-info.ts
import { personalInfoSchema } from '../schema';
import { savePersonalInfo as dbSavePersonalInfo } from '../db/mutations';

export async function savePersonalInfo(data: unknown) {
	const validated = personalInfoSchema(data);
	if (validated instanceof type.errors) {
		return { success: false, errors: validated };
	}

	await dbSavePersonalInfo(validated);
	return { success: true };
}
```

### Route Implementation Pattern

```typescript
// src/routes/onboarding/manual/+page.server.ts
import { savePersonalInfo } from '$lib/modules/onboarding/actions/personal-info';
import { superValidate } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';
import { personalInfoSchema } from '$lib/modules/onboarding/schema';

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, arktype(personalInfoSchema));

		if (!form.valid) return fail(400, { form });

		const result = await savePersonalInfo(form.data);
		if (!result.success) {
			return fail(400, { form, errors: result.errors });
		}

		redirect(302, '/onboarding/manual/step-2');
	}
};
```

### Database Schema Migration

```sql
-- Add onboarding fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS activity_level TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS weight_goal TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS disliked_ingredients TEXT[];

-- Create dietary options table
CREATE TABLE IF NOT EXISTS dietary_options (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL
);
```

## Key Considerations

### Module Benefits

- **Separation of Concerns**: Business logic separate from UI
- **Reusability**: Components can be reused across routes
- **Testability**: Module functions easy to unit test
- **Maintainability**: Clear structure following existing patterns

### Breaking Changes from Next.js

1. **Form Library**: TanStack Form → Superforms
2. **Validation**: Valibot → Arktype
3. **Database**: Supabase → Drizzle + PostgreSQL
4. **File Structure**: App Router → SvelteKit + Modules

### Image Upload Strategy

- Store uploads in `uploads/avatars/` directory
- Generate unique filenames with user ID
- Serve via static file handler
- Resize/optimize images server-side

## Success Criteria

- [ ] All 3 manual onboarding steps functional
- [ ] Data persistence working correctly
- [ ] UI matches existing Next.js design
- [ ] Form validation working with arktype
- [ ] Avatar upload functional
- [ ] Step navigation working
- [ ] Mobile responsive design
- [ ] Module structure follows existing patterns
- [ ] Database integration complete
- [ ] Error handling robust

## Timeline: 9 Days Total

- **Phase 1**: 2 days (Foundation & Module Setup)
- **Phase 2**: 2 days (Core Module Components)
- **Phase 3**: 2 days (Manual Onboarding Implementation)
- **Phase 4**: 2 days (Integration & Polish)
- **Phase 5**: 1 day (Testing & Deployment)
