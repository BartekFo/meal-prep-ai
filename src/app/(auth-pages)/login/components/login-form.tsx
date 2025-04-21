import { login } from "@/app/(auth-pages)/login/actions";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FormCard } from "../../components/form-card";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <FormCard
      title="Login"
      description="Sign in to access your recipes and meal plans"
    >
      <CardContent>
        <form className={cn("flex flex-col gap-6", className)} {...props}>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
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
              <Input id="password" name="password" type="password" required />
            </div>
            <Button formAction={login} className="w-full">
              Login
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="relative flex w-full items-center">
          <div className="flex-grow border-gray-300 border-t" />
          <span className="mx-4 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-gray-300 border-t" />
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </FormCard>
  );
}
