import { Card, CardContent } from "@/components/ui/card";

export function RecipeFormCard({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-5">{children}</CardContent>
    </Card>
  );
}
