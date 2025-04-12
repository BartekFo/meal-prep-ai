import Image from "next/image";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background">
			{children}
			<div className="hidden md:block bg-sidebar-accent relative aspect-auto rounded-lg overflow-hidden shadow-md">
				<Image
					src={"/auth-background-food-boxes.jpg?height=600&width=600&text=Meal"}
					alt={"Meal prep image"}
					fill
					className="object-cover"
				/>
			</div>
		</div>
	);
}
