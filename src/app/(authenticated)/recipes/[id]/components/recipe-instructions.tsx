import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecipeInstructionsProps {
	instructions: string[];
}

export function RecipeInstructions({ instructions }: RecipeInstructionsProps) {
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-lg">Instructions</CardTitle>
			</CardHeader>
			<CardContent>
				<ol className="space-y-4">
					{instructions.map((instruction, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<li key={index} className="flex gap-3">
							<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-sm">
								{index + 1}
							</div>
							<p className="pt-0.5">{instruction}</p>
						</li>
					))}
				</ol>
			</CardContent>
		</Card>
	);
}
