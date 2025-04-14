import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RecipeListSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 6 }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: No Better Option here
				<Card key={index} className="overflow-hidden">
					<Skeleton className="aspect-video w-full" />
					<CardHeader className="p-4">
						<Skeleton className="h-6 w-3/4" />
						<Skeleton className="mt-2 h-4 w-full" />
					</CardHeader>
					<CardContent className="p-4 pt-0">
						<Skeleton className="h-4 w-1/2" />
						<div className="mt-4 flex justify-between">
							{Array.from({ length: 4 }).map((_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: No Better Option here
								<div key={i} className="text-center">
									<Skeleton className="mx-auto h-4 w-8" />
									<Skeleton className="mx-auto mt-1 h-3 w-12" />
								</div>
							))}
						</div>
					</CardContent>
					<CardFooter className="p-4 pt-0">
						<Skeleton className="h-9 w-full" />
					</CardFooter>
				</Card>
			))}
		</div>
	);
}
