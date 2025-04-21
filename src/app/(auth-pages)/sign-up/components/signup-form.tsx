import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FormCard } from "../../components/form-card";
import { signup } from "../actions";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <FormCard
      title="Create an account"
      description="Enter your email below to create an account"
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
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button formAction={signup} className="w-full">
              Sign up
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
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </CardFooter>
    </FormCard>
  );
}
