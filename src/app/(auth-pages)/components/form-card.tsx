import { UtensilsCrossed } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IFormCardProps {
  title: string;
  description: string;
}

export function FormCard({
  title,
  description,
  children,
}: React.PropsWithChildren<IFormCardProps>) {
  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="flex flex-col items-center space-y-1">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-foreground">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-center font-bold text-2xl">
          {title}
        </CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      {children}
    </Card>
  );
}
