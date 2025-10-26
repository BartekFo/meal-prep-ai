<script lang="ts">
  import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
  } from "$lib/components/ui/card";
  import { Skeleton } from "$lib/components/ui/skeleton";
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
	{#each Array(6) as _, index}
		<Card class="overflow-hidden">
			<Skeleton class="aspect-video w-full" />
			<CardHeader class="p-4">
				<Skeleton class="h-6 w-3/4" />
				<Skeleton class="mt-2 h-4 w-full" />
			</CardHeader>
			<CardContent class="p-4 pt-0">
				<Skeleton class="h-4 w-1/2" />
				<div class="mt-4 flex justify-between">
					{#each Array(4) as _, i}
						<div class="text-center">
							<Skeleton class="mx-auto h-4 w-8" />
							<Skeleton class="mx-auto mt-1 h-3 w-12" />
						</div>
					{/each}
				</div>
			</CardContent>
			<CardFooter class="p-4 pt-0">
				<Skeleton class="h-9 w-full" />
			</CardFooter>
		</Card>
	{/each}
</div>
