export default function ManualLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border bg-background p-6 shadow-sm">
          {children}
        </div>
      </div>
    </main>
  );
}
