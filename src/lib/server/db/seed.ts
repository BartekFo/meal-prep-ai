import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { user, recipes, account } from './schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from 'better-auth/crypto';

// Get DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Create database connection for seed script
const client = postgres(DATABASE_URL);
const db = drizzle(client);

const SEED_USER = {
  id: 'seed_user_1',
  email: 'demo@mealprep.com',
  password: 'demo123', // This will be hashed
  name: 'Demo User',
  firstName: 'Demo',
  lastName: 'User',
  emailVerified: true,
  dateOfBirth: new Date('1990-01-15'),
  gender: 'male',
  activityLevel: 'moderately_active',
  currentWeight: 75,
  height: 180,
  weightGoal: 'maintain',
  dietaryType: 'balanced',
  allergies: 'none',
  dislikedFoods: 'liver, blue cheese',
  preferredMealTypes: ['breakfast', 'lunch', 'dinner'],
  onboardingStatus: 'completed' as const,
  onboardingCompletedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const SEED_RECIPES = [
  {
    userId: SEED_USER.id,
    title: 'Classic Avocado Toast',
    description: 'A simple and nutritious breakfast with creamy avocado on toasted whole grain bread',
    ingredients: [
      '2 slices whole grain bread',
      '1 ripe avocado',
      '1 tsp lemon juice',
      'Salt and pepper to taste',
      'Red pepper flakes (optional)',
      '1 egg (optional)',
    ],
    servings: 1,
    prepTime: 5,
    cookTime: 5,
    mealType: 'breakfast' as const,
    instructions: [
      'Toast the bread slices until golden brown',
      'Mash the avocado in a bowl with lemon juice, salt, and pepper',
      'Spread the avocado mixture evenly on the toasted bread',
      'Sprinkle with red pepper flakes if desired',
      'Optional: Top with a fried or poached egg',
    ],
    calories: 320,
    protein: 12,
    carbs: 35,
    fat: 16,
  },
  {
    userId: SEED_USER.id,
    title: 'Mediterranean Quinoa Bowl',
    description: 'A protein-packed lunch bowl with quinoa, fresh vegetables, and feta cheese',
    ingredients: [
      '1 cup cooked quinoa',
      '1/2 cup cherry tomatoes, halved',
      '1/2 cucumber, diced',
      '1/4 red onion, thinly sliced',
      '1/4 cup feta cheese, crumbled',
      '2 tbsp kalamata olives',
      '2 tbsp olive oil',
      '1 tbsp lemon juice',
      'Fresh parsley',
      'Salt and pepper',
    ],
    servings: 2,
    prepTime: 15,
    cookTime: 0,
    mealType: 'lunch' as const,
    instructions: [
      'Cook quinoa according to package instructions and let cool',
      'In a large bowl, combine quinoa, tomatoes, cucumber, and red onion',
      'Drizzle with olive oil and lemon juice',
      'Season with salt and pepper',
      'Top with feta cheese, olives, and fresh parsley',
      'Toss gently and serve',
    ],
    calories: 380,
    protein: 14,
    carbs: 42,
    fat: 18,
  },
  {
    userId: SEED_USER.id,
    title: 'Grilled Chicken with Roasted Vegetables',
    description: 'A healthy dinner featuring tender grilled chicken breast with colorful roasted vegetables',
    ingredients: [
      '2 chicken breasts (about 6 oz each)',
      '2 bell peppers, cut into chunks',
      '1 zucchini, sliced',
      '1 red onion, cut into wedges',
      '2 tbsp olive oil',
      '2 cloves garlic, minced',
      '1 tsp Italian seasoning',
      'Salt and pepper',
      'Fresh basil for garnish',
    ],
    servings: 2,
    prepTime: 15,
    cookTime: 25,
    mealType: 'dinner' as const,
    instructions: [
      'Preheat oven to 425°F (220°C)',
      'Season chicken breasts with salt, pepper, and Italian seasoning',
      'Heat a grill pan over medium-high heat and cook chicken for 6-7 minutes per side',
      'Meanwhile, toss vegetables with olive oil, garlic, salt, and pepper',
      'Spread vegetables on a baking sheet and roast for 20-25 minutes',
      'Let chicken rest for 5 minutes before slicing',
      'Serve chicken with roasted vegetables and garnish with fresh basil',
    ],
    calories: 450,
    protein: 42,
    carbs: 28,
    fat: 18,
  },
  {
    userId: SEED_USER.id,
    title: 'Energy Protein Balls',
    description: 'No-bake energy balls packed with oats, peanut butter, and dark chocolate chips',
    ingredients: [
      '1 cup rolled oats',
      '1/2 cup natural peanut butter',
      '1/3 cup honey',
      '1/3 cup dark chocolate chips',
      '2 tbsp ground flaxseed',
      '1 tsp vanilla extract',
      'Pinch of salt',
    ],
    servings: 12,
    prepTime: 10,
    cookTime: 0,
    mealType: 'snack' as const,
    instructions: [
      'In a large bowl, mix all ingredients until well combined',
      'Refrigerate the mixture for 30 minutes to make it easier to handle',
      'Roll the mixture into 12 equal-sized balls (about 1 inch diameter)',
      'Store in an airtight container in the refrigerator for up to 1 week',
      'Enjoy as a pre-workout snack or healthy treat',
    ],
    calories: 120,
    protein: 4,
    carbs: 15,
    fat: 6,
  },
  {
    userId: SEED_USER.id,
    title: 'Greek Yogurt Parfait',
    description: 'Layered breakfast parfait with Greek yogurt, fresh berries, and granola',
    ingredients: [
      '1 cup Greek yogurt (plain or vanilla)',
      '1/2 cup mixed berries (strawberries, blueberries, raspberries)',
      '1/4 cup granola',
      '1 tbsp honey',
      '1 tbsp sliced almonds',
      'Fresh mint leaves (optional)',
    ],
    servings: 1,
    prepTime: 5,
    cookTime: 0,
    mealType: 'breakfast' as const,
    instructions: [
      'In a glass or bowl, add a layer of Greek yogurt',
      'Add a layer of mixed berries',
      'Sprinkle some granola on top',
      'Repeat layers if desired',
      'Drizzle with honey',
      'Top with sliced almonds and mint leaves',
    ],
    calories: 310,
    protein: 20,
    carbs: 42,
    fat: 8,
  },
  {
    userId: SEED_USER.id,
    title: 'Spicy Tuna Poke Bowl',
    description: 'Fresh tuna poke bowl with sushi rice, edamame, and avocado',
    ingredients: [
      '8 oz sushi-grade tuna, cubed',
      '2 cups cooked sushi rice',
      '2 tbsp soy sauce',
      '1 tbsp sesame oil',
      '1 tsp sriracha',
      '1/2 cup edamame',
      '1 avocado, sliced',
      '1/4 cup shredded carrots',
      '2 tbsp green onions, sliced',
      '1 tbsp sesame seeds',
      'Nori strips for garnish',
    ],
    servings: 2,
    prepTime: 20,
    cookTime: 0,
    mealType: 'lunch' as const,
    instructions: [
      'In a bowl, mix tuna with soy sauce, sesame oil, and sriracha',
      'Let tuna marinate for 10 minutes in the refrigerator',
      'Divide sushi rice between two bowls',
      'Top with marinated tuna, edamame, avocado, and carrots',
      'Garnish with green onions, sesame seeds, and nori strips',
      'Serve immediately',
    ],
    calories: 520,
    protein: 35,
    carbs: 58,
    fat: 16,
  },
  {
    userId: SEED_USER.id,
    title: 'Baked Salmon with Asparagus',
    description: 'Oven-baked salmon fillet with garlic butter asparagus and lemon',
    ingredients: [
      '2 salmon fillets (6 oz each)',
      '1 bunch asparagus, trimmed',
      '3 tbsp butter, melted',
      '3 cloves garlic, minced',
      '1 lemon, sliced',
      '1 tsp dried dill',
      'Salt and pepper',
      'Fresh parsley for garnish',
    ],
    servings: 2,
    prepTime: 10,
    cookTime: 15,
    mealType: 'dinner' as const,
    instructions: [
      'Preheat oven to 400°F (200°C)',
      'Line a baking sheet with parchment paper',
      'Arrange salmon fillets and asparagus on the baking sheet',
      'Mix melted butter with garlic and brush over salmon and asparagus',
      'Season with dill, salt, and pepper',
      'Place lemon slices on top of salmon',
      'Bake for 12-15 minutes until salmon flakes easily',
      'Garnish with fresh parsley and serve',
    ],
    calories: 420,
    protein: 40,
    carbs: 8,
    fat: 26,
  },
  {
    userId: SEED_USER.id,
    title: 'Hummus and Veggie Sticks',
    description: 'Creamy homemade hummus served with fresh vegetable sticks',
    ingredients: [
      '1 can (15 oz) chickpeas, drained',
      '3 tbsp tahini',
      '2 tbsp olive oil',
      '2 tbsp lemon juice',
      '2 cloves garlic',
      '1/2 tsp cumin',
      'Salt to taste',
      'Carrots, celery, bell peppers for dipping',
    ],
    servings: 4,
    prepTime: 10,
    cookTime: 0,
    mealType: 'snack' as const,
    instructions: [
      'In a food processor, combine chickpeas, tahini, olive oil, lemon juice, garlic, and cumin',
      'Blend until smooth, adding water if needed to reach desired consistency',
      'Season with salt to taste',
      'Transfer to a serving bowl',
      'Cut vegetables into sticks',
      'Serve hummus with vegetable sticks',
    ],
    calories: 180,
    protein: 6,
    carbs: 18,
    fat: 10,
  },
];

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, SEED_USER.email));

    let userId = SEED_USER.id;

    if (existingUser.length > 0) {
      console.log('⚠️  User already exists, using existing user');
      userId = existingUser[0].id;
    } else {
      // Create user
      console.log('👤 Creating demo user...');
      const [newUser] = await db
        .insert(user)
        .values(SEED_USER)
        .returning();
      userId = newUser.id;

      // Hash the password using Better Auth's crypto
      console.log('🔒 Hashing password...');
      const hashedPassword = await hashPassword(SEED_USER.password);

      // Create account with hashed password
      await db.insert(account).values({
        id: `account_${userId}`,
        accountId: SEED_USER.email,
        providerId: 'credential',
        userId,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log('✅ Demo user created');
    }

    // Check if recipes already exist
    const existingRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.userId, userId));

    if (existingRecipes.length > 0) {
      console.log('⚠️  Recipes already exist for this user');
      console.log(`   Found ${existingRecipes.length} existing recipes`);

      const response = await new Promise<string>((resolve) => {
        process.stdout.write('   Do you want to delete and re-seed recipes? (y/n): ');
        process.stdin.once('data', (data) => {
          resolve(data.toString().trim().toLowerCase());
        });
      });

      if (response === 'y' || response === 'yes') {
        console.log('🗑️  Deleting existing recipes...');
        await db.delete(recipes).where(eq(recipes.userId, userId));
      } else {
        console.log('⏭️  Skipping recipe seeding');
        console.log('✨ Seed completed!');
        return;
      }
    }

    // Create recipes
    console.log('🍽️  Creating sample recipes...');
    const recipesWithUserId = SEED_RECIPES.map((recipe) => ({
      ...recipe,
      userId,
      createdAt: new Date(),
    }));

    await db.insert(recipes).values(recipesWithUserId);

    console.log('✅ Created recipes:');
    SEED_RECIPES.forEach((recipe) => {
      console.log(`   - ${recipe.title} (${recipe.mealType})`);
    });

    console.log('\n✨ Seed completed successfully!');
    console.log('\n📋 Demo Account Credentials:');
    console.log(`   Email: ${SEED_USER.email}`);
    console.log(`   Password: ${SEED_USER.password}`);
    console.log(`   Recipes: ${SEED_RECIPES.length} meals\n`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      console.log('👋 Exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to seed:', error);
      process.exit(1);
    });
}

export { seed };
