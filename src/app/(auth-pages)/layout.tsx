import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 gap-4 bg-background p-4 md:grid-cols-2">
      {children}
      <div className="relative hidden aspect-auto overflow-hidden rounded-lg bg-sidebar-accent shadow-md md:block">
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
