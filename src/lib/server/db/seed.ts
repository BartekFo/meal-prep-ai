import { hashPassword } from 'better-auth/crypto';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { account, recipes, user } from './schema';

// Get DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

// Extract file path from DATABASE_URL (format: file:/path/to/db.sqlite)
const dbPath = DATABASE_URL.replace('file:', '');
const sqlite = new Database(dbPath, { strict: true });

// Create database connection for seed script
const db = drizzle(sqlite);

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
	updatedAt: new Date()
};

const SEED_RECIPES = [
	{
		userId: SEED_USER.id,
		title: 'Classic Avocado Toast',
		description:
			'A simple and nutritious breakfast with creamy avocado on toasted whole grain bread',
		ingredients: [
			'2 slices whole grain bread',
			'1 ripe avocado',
			'1 tsp lemon juice',
			'Salt and pepper to taste',
			'Red pepper flakes (optional)',
			'1 egg (optional)'
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
			'Optional: Top with a fried or poached egg'
		],
		calories: 320,
		protein: 12,
		carbs: 35,
		fat: 16
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
			'Salt and pepper'
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
			'Toss gently and serve'
		],
		calories: 380,
		protein: 14,
		carbs: 42,
		fat: 18
	},
	{
		userId: SEED_USER.id,
		title: 'Grilled Chicken with Roasted Vegetables',
		description:
			'A healthy dinner featuring tender grilled chicken breast with colorful roasted vegetables',
		ingredients: [
			'2 chicken breasts (about 6 oz each)',
			'2 bell peppers, cut into chunks',
			'1 zucchini, sliced',
			'1 red onion, cut into wedges',
			'2 tbsp olive oil',
			'2 cloves garlic, minced',
			'1 tsp Italian seasoning',
			'Salt and pepper',
			'Fresh basil for garnish'
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
			'Serve chicken with roasted vegetables and garnish with fresh basil'
		],
		calories: 450,
		protein: 42,
		carbs: 28,
		fat: 18
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
			'Pinch of salt'
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
			'Enjoy as a pre-workout snack or healthy treat'
		],
		calories: 120,
		protein: 4,
		carbs: 15,
		fat: 6
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
			'Fresh mint leaves (optional)'
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
			'Top with sliced almonds and mint leaves'
		],
		calories: 310,
		protein: 20,
		carbs: 42,
		fat: 8
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
			'Nori strips for garnish'
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
			'Serve immediately'
		],
		calories: 520,
		protein: 35,
		carbs: 58,
		fat: 16
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
			'Fresh parsley for garnish'
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
			'Garnish with fresh parsley and serve'
		],
		calories: 420,
		protein: 40,
		carbs: 8,
		fat: 26
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
			'Carrots, celery, bell peppers for dipping'
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
			'Serve hummus with vegetable sticks'
		],
		calories: 180,
		protein: 6,
		carbs: 18,
		fat: 10
	},
	{
		userId: SEED_USER.id,
		title: 'Pasta Primavera',
		description: 'Light and fresh pasta with seasonal vegetables and garlic-infused olive oil',
		ingredients: [
			'8 oz whole wheat pasta',
			'2 cups fresh zucchini, sliced',
			'1 cup cherry tomatoes, halved',
			'1 cup asparagus, cut into pieces',
			'3 cloves garlic, minced',
			'3 tbsp olive oil',
			'1/4 cup fresh basil, chopped',
			'2 tbsp grated Parmesan cheese',
			'Salt and pepper to taste',
			'Red pepper flakes'
		],
		servings: 2,
		prepTime: 10,
		cookTime: 12,
		mealType: 'lunch' as const,
		instructions: [
			'Cook pasta according to package directions until al dente, then drain',
			'In a large pan, heat olive oil over medium heat',
			'Add garlic and cook for 30 seconds until fragrant',
			'Add zucchini, asparagus, and cherry tomatoes',
			'Sauté vegetables for 5-7 minutes until tender-crisp',
			'Add cooked pasta to the pan and toss to combine',
			'Season with salt, pepper, and red pepper flakes',
			'Top with fresh basil and Parmesan cheese before serving'
		],
		calories: 380,
		protein: 14,
		carbs: 48,
		fat: 14
	},
	{
		userId: SEED_USER.id,
		title: 'Turkey Meatballs with Marinara',
		description: 'Lean turkey meatballs baked with marinara sauce and served with pasta',
		ingredients: [
			'1 lb ground turkey',
			'1/2 cup panko breadcrumbs',
			'1 egg',
			'1/4 cup grated Parmesan cheese',
			'3 cloves garlic, minced',
			'1 tsp Italian seasoning',
			'1/2 cup whole wheat pasta',
			'2 cups marinara sauce',
			'Salt and pepper to taste',
			'Fresh parsley for garnish'
		],
		servings: 4,
		prepTime: 15,
		cookTime: 20,
		mealType: 'dinner' as const,
		instructions: [
			'Preheat oven to 400°F (200°C)',
			'In a bowl, combine ground turkey, breadcrumbs, egg, Parmesan, garlic, and Italian seasoning',
			'Season with salt and pepper',
			'Form into 16-20 meatballs and arrange on a baking sheet',
			'Bake for 15-20 minutes until cooked through',
			'Meanwhile, cook pasta according to package directions',
			'Heat marinara sauce in a large pot',
			'Add cooked meatballs to marinara sauce and simmer for 5 minutes',
			'Serve meatballs and sauce over pasta',
			'Garnish with fresh parsley'
		],
		calories: 410,
		protein: 38,
		carbs: 38,
		fat: 12
	},
	{
		userId: SEED_USER.id,
		title: 'Sweet Potato and Black Bean Bowl',
		description: 'Hearty vegan bowl with roasted sweet potato, black beans, and tahini dressing',
		ingredients: [
			'1 large sweet potato, cubed',
			'1 can (15 oz) black beans, drained and rinsed',
			'2 cups fresh kale, chopped',
			'1/2 cup cooked quinoa',
			'1/4 red onion, thinly sliced',
			'2 tbsp tahini',
			'1 tbsp lemon juice',
			'1 tbsp water',
			'1 clove garlic, minced',
			'2 tbsp olive oil',
			'Salt and pepper to taste',
			'Pumpkin seeds for topping'
		],
		servings: 2,
		prepTime: 15,
		cookTime: 25,
		mealType: 'lunch' as const,
		instructions: [
			'Preheat oven to 425°F (220°C)',
			'Toss sweet potato cubes with olive oil, salt, and pepper',
			'Roast for 20-25 minutes until tender and caramelized',
			'While potatoes roast, prepare tahini dressing by mixing tahini, lemon juice, water, and garlic',
			'Season dressing with salt and pepper',
			'In a pot, heat black beans with a pinch of cumin',
			'Massage kale with a bit of lemon juice to soften',
			'Divide quinoa, kale, and red onion between two bowls',
			'Top with roasted sweet potato and warm black beans',
			'Drizzle with tahini dressing',
			'Garnish with pumpkin seeds and serve'
		],
		calories: 440,
		protein: 16,
		carbs: 52,
		fat: 18
	}
];

async function seed() {
	// Check if user already exists
	const existingUser = await db.select().from(user).where(eq(user.email, SEED_USER.email));

	let userId = SEED_USER.id;

	if (existingUser.length > 0) {
		userId = existingUser[0]?.id ?? '';
	} else {
		const [newUser] = await db.insert(user).values(SEED_USER).returning();
		userId = newUser?.id ?? '';
		const hashedPassword = await hashPassword(SEED_USER.password);

		// Create account with hashed password
		await db.insert(account).values({
			id: `account_${userId}`,
			accountId: SEED_USER.email,
			providerId: 'credential',
			userId,
			password: hashedPassword,
			createdAt: new Date(),
			updatedAt: new Date()
		});
	}

	// Check if recipes already exist
	const existingRecipes = await db.select().from(recipes).where(eq(recipes.userId, userId));

	if (existingRecipes.length > 0) {
		const response = await new Promise<string>((resolve) => {
			process.stdout.write('   Do you want to delete and re-seed recipes? (y/n): ');
			process.stdin.once('data', (data) => {
				resolve(data.toString().trim().toLowerCase());
			});
		});

		if (response === 'y' || response === 'yes') {
			await db.delete(recipes).where(eq(recipes.userId, userId));
		} else {
			return;
		}
	}
	const recipesWithUserId = SEED_RECIPES.map((recipe) => ({
		...recipe,
		userId,
		createdAt: new Date()
	}));

	await db.insert(recipes).values(recipesWithUserId);
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	seed()
		.then(() => {
			process.exit(0);
		})
		.catch(() => {
			process.exit(1);
		});
}

export { seed };
