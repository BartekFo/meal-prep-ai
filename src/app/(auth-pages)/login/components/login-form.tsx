import { login } from "@/app/(auth-pages)/login/actions";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	return (
		<Card className="w-full shadow-xl">
			<CardHeader className="space-y-1 flex flex-col items-center">
				<div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center mb-2">
					<UtensilsCrossed className="h-6 w-6 text-primary" />
				</div>
				<CardTitle className="text-2xl font-bold text-center">
					MealPrepingAI
				</CardTitle>
				<CardDescription className="text-center">
					Sign in to access your recipes and meal plans
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form className={cn("flex flex-col gap-6", className)} {...props}>
					<div className="grid gap-6">
						<div className="grid gap-3">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								required
							/>
						</div>
						<div className="grid gap-3">
							<div className="flex items-center">
								<Label htmlFor="password">Password</Label>
								<Link
									href="/forgot-password"
									className="ml-auto text-sm underline-offset-4 hover:underline"
								>
									Forgot your password?
								</Link>
							</div>
							<Input id="password" type="password" required />
						</div>
						<Button formAction={login} className="w-full">
							Login
						</Button>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col space-y-4">
				<div className="relative flex items-center w-full">
					<div className="flex-grow border-t border-gray-300" />
					<span className="mx-4 text-sm text-gray-500">or</span>
					<div className="flex-grow border-t border-gray-300" />
				</div>
				<div className="text-center text-sm">
					Don&apos;t have an account?{" "}
					<Link href="/sign-up" className="underline underline-offset-4">
						Sign up
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}
