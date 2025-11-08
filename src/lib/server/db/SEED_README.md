# Database Seeding

This directory contains a reusable database seed script to populate your database with sample data for development and testing.

## Quick Start

```bash
# Run the seed script
bun db:seed
```

## What Gets Seeded

### Demo User

- **Email:** demo@mealprep.com
- **Password:** demo123
- **Profile:** Fully completed onboarding with sample preferences
  - Name: Demo User
  - Age: 35 years old (born Jan 15, 1990)
  - Gender: Male
  - Weight: 75 kg
  - Height: 180 cm
  - Activity Level: Moderately Active
  - Weight Goal: Maintain
  - Dietary Type: Balanced
  - Allergies: None
  - Disliked Foods: Liver, Blue cheese

### Sample Recipes (8 meals)

#### Breakfast (2 recipes)

1. **Classic Avocado Toast** - Simple and nutritious (320 cal)
2. **Greek Yogurt Parfait** - Layered with berries and granola (310 cal)

#### Lunch (2 recipes)

1. **Mediterranean Quinoa Bowl** - Protein-packed with vegetables (380 cal)
2. **Spicy Tuna Poke Bowl** - Fresh sushi-grade tuna (520 cal)

#### Dinner (2 recipes)

1. **Grilled Chicken with Roasted Vegetables** - Healthy and filling (450 cal)
2. **Baked Salmon with Asparagus** - Omega-3 rich (420 cal)

#### Snacks (2 recipes)

1. **Energy Protein Balls** - No-bake energy boost (120 cal per ball)
2. **Hummus and Veggie Sticks** - Fresh and crunchy (180 cal)

## Features

### Idempotent Seeding

The seed script is smart about existing data:

- If the user already exists, it will reuse that user
- If recipes already exist, it will ask if you want to re-seed them
- You can run it multiple times safely

### Reusable

The seed script can be run:

- During development to reset your data
- In CI/CD for testing
- When setting up a new environment

## Customization

Edit `/Users/bartosz.f/work/meal-prep-ai/src/lib/server/db/seed.ts` to:

- Add more recipes
- Change user preferences
- Adjust nutritional values
- Add different meal types

### Adding a New Recipe

```typescript
{
  userId: SEED_USER.id,
  title: 'Your Recipe Name',
  description: 'A brief description',
  ingredients: [
    'ingredient 1',
    'ingredient 2',
  ],
  servings: 2,
  prepTime: 10, // minutes
  cookTime: 20, // minutes
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  instructions: [
    'Step 1',
    'Step 2',
  ],
  calories: 400,
  protein: 30,
  carbs: 40,
  fat: 15,
}
```

## Database Commands

```bash
# Start database
bun db:start

# Run migrations
bun db:migrate

# Seed database
bun db:seed

# Open Drizzle Studio (database GUI)
bun db:studio
```

## How It Works

The seed script properly handles authentication by:

1. Creating the user record with profile information
2. Hashing the password using Better Auth's `hashPassword` function
3. Creating the account record with the hashed password

This ensures the demo user can successfully log in to your application.

## Troubleshooting

### Error: DATABASE_URL is not set

Make sure you have a `.env` file with:

```
DATABASE_URL=postgresql://root:mysecretpassword@localhost:5434/local
```

### Error: Cannot connect to database

Make sure the database is running:

```bash
docker ps  # Check if container is running
bun db:start  # Start if not running
```

### Error: hex string expected, got undefined

This means the password wasn't properly hashed. The seed script now uses Better Auth's `hashPassword` to ensure passwords are properly hashed before storage.

### Clear All Data and Re-seed

```bash
# Drop all tables and re-run migrations
bun db:push --force
bun db:migrate
bun db:seed
```
