import { ModeSelector } from "./components/mode-selector";

export default async function OnboardingPage() {
  return (
    <main className="flex-1 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border bg-background p-6 shadow-sm">
          <ModeSelector />
        </div>
      </div>
    </main>
  );
}
