import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-5xl animate-pulse p-6 pt-24">
      <div className="mb-6 flex items-center justify-between">
        {/* Back Button Skeleton */}
        <Skeleton className="h-9 w-36 rounded-md" />
        <div className="flex gap-2">
          {/* Print/Share Button Skeletons */}
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>

      {/* Image Skeleton */}
      <Skeleton className="relative mb-6 aspect-video w-full rounded-lg" />

      <div className="mb-8">
        {/* Title Skeleton */}
        <Skeleton className="mb-2 h-8 w-3/4 rounded" />
        {/* Description Skeleton */}
        <Skeleton className="h-6 w-full rounded" />
        <Skeleton className="mt-1 h-6 w-2/3 rounded" />
      </div>

      {/* Time/Servings Card Skeletons */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          <Card key={`time-skeleton-${i}`} className="p-4">
            <Skeleton className="mx-auto mb-2 h-4 w-20 rounded" />
            <Skeleton className="mx-auto h-6 w-16 rounded" />
          </Card>
        ))}
      </div>

      {/* Nutrition Skeleton */}
      <div className="mb-4">
        <Skeleton className="mb-4 h-6 w-32 rounded" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            <Card key={`nutrition-skeleton-${i}`} className="p-4">
              <Skeleton className="mx-auto mb-2 h-4 w-16 rounded" />
              <Skeleton className="mx-auto h-5 w-12 rounded" />
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Ingredients/Instructions Skeletons */}
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Skeleton className="mb-4 h-6 w-40 rounded" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                key={`ingredient-skeleton-${i}`}
                className="h-5 w-full rounded"
              />
            ))}
            <Skeleton className="h-5 w-2/3 rounded" />
          </div>
        </div>
        <div>
          <Skeleton className="mb-4 h-6 w-40 rounded" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                key={`instruction-skeleton-${i}`}
                className="flex items-start gap-3"
              >
                <Skeleton className="mt-1 h-6 w-6 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-full rounded" />
                  <Skeleton className="h-5 w-4/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
