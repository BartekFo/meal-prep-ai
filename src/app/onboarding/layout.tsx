import { AppLogo } from "@/components/app-logo";
import { routes } from "@/lib/constants/routes";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <header className="border-b bg-background px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href={routes.onboarding.root}>
            <AppLogo />
          </Link>
          <Link className="flex items-center gap-2" href="/auth/logout">
            <LogOut />
            Log out
          </Link>
        </div>
      </header>

      {children}
    </div>
  );
}
