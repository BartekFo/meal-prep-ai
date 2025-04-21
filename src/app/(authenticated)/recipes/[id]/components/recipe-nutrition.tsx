import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RecipeNutritionProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function RecipeNutrition({
  calories,
  protein,
  carbs,
  fat,
}: RecipeNutritionProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Nutrition Information</CardTitle>
        <CardDescription>Per serving</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="font-bold text-2xl">{calories}</p>
            <p className="text-muted-foreground text-sm">Calories</p>
          </div>
          <div>
            <p className="font-bold text-2xl">{protein}g</p>
            <p className="text-muted-foreground text-sm">Protein</p>
          </div>
          <div>
            <p className="font-bold text-2xl">{carbs}g</p>
            <p className="text-muted-foreground text-sm">Carbs</p>
          </div>
          <div>
            <p className="font-bold text-2xl">{fat}g</p>
            <p className="text-muted-foreground text-sm">Fat</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
