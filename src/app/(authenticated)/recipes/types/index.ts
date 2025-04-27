export type Recipe = {
  id: string;
  title: string;
  description: string | null;
  mealType: string;
  prepTime: string;
  cookTime: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl: string | null;
};
