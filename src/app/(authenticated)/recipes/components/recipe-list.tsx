import { RecipeCard } from "./recipe-card";

// This would typically come from a database
const recipes = [
  {
    id: "1",
    title: "Chicken Stir Fry",
    description: "A quick and healthy weeknight dinner option.",
    image: "/placeholder.svg?height=200&width=300",
    prepTime: "15 min",
    cookTime: "20 min",
    mealType: "dinner",
    calories: 450,
    protein: 35,
    carbs: 30,
    fat: 15,
  },
  {
    id: "2",
    title: "Overnight Oats",
    description: "Prepare the night before for a quick breakfast.",
    image: "/placeholder.svg?height=200&width=300",
    prepTime: "10 min",
    cookTime: "0 min",
    mealType: "breakfast",
    calories: 350,
    protein: 15,
    carbs: 55,
    fat: 8,
  },
  {
    id: "3",
    title: "Greek Salad",
    description: "Fresh and tangy salad perfect for lunch.",
    image: "/placeholder.svg?height=200&width=300",
    prepTime: "15 min",
    cookTime: "0 min",
    mealType: "lunch",
    calories: 320,
    protein: 12,
    carbs: 18,
    fat: 22,
  },
  {
    id: "4",
    title: "Salmon with Roasted Vegetables",
    description: "Nutritious and delicious dinner option.",
    image: "/placeholder.svg?height=200&width=300",
    prepTime: "15 min",
    cookTime: "25 min",
    mealType: "dinner",
    calories: 520,
    protein: 40,
    carbs: 25,
    fat: 28,
  },
  {
    id: "5",
    title: "Protein Smoothie Bowl",
    description: "Perfect post-workout breakfast.",
    image: "/placeholder.svg?height=200&width=300",
    prepTime: "10 min",
    cookTime: "0 min",
    mealType: "breakfast",
    calories: 380,
    protein: 25,
    carbs: 45,
    fat: 10,
  },
  {
    id: "6",
    title: "Turkey Wrap",
    description: "Quick and easy lunch on the go.",
    image: "/placeholder.svg?height=200&width=300",
    prepTime: "10 min",
    cookTime: "0 min",
    mealType: "lunch",
    calories: 410,
    protein: 30,
    carbs: 40,
    fat: 12,
  },
];

export function RecipeList() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
