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
			<CardHeader className="space-y-1 flex flex-col items-center">
				<div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center mb-2">
					<UtensilsCrossed className="h-6 w-6 text-primary" />
				</div>
				<CardTitle className="text-2xl font-bold text-center">
					{title}
				</CardTitle>
				<CardDescription className="text-center">{description}</CardDescription>
			</CardHeader>
			{children}
		</Card>
	);
}
