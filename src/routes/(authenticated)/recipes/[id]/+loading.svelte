<script>
	import { Card } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="container mx-auto max-w-5xl animate-pulse p-6 pt-24">
	<div class="mb-6 flex items-center justify-between">
		<!-- Back Button Skeleton -->
		<Skeleton class="h-9 w-36 rounded-md" />
		<div class="flex gap-2">
			<!-- Print/Share Button Skeletons -->
			<Skeleton class="h-9 w-24 rounded-md" />
			<Skeleton class="h-9 w-24 rounded-md" />
		</div>
	</div>

	<!-- Image Skeleton -->
	<Skeleton class="relative mb-6 aspect-video w-full rounded-lg" />

	<div class="mb-8">
		<!-- Title Skeleton -->
		<Skeleton class="mb-2 h-8 w-3/4 rounded" />
		<!-- Description Skeleton -->
		<Skeleton class="h-6 w-full rounded" />
		<Skeleton class="mt-1 h-6 w-2/3 rounded" />
	</div>

	<!-- Time/Servings Card Skeletons -->
	<div class="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
		{#each Array(4) as _, i}
			<Card class="p-4">
				<Skeleton class="mx-auto mb-2 h-4 w-20 rounded" />
				<Skeleton class="mx-auto h-6 w-16 rounded" />
			</Card>
		{/each}
	</div>

	<!-- Nutrition Skeleton -->
	<div class="mb-4">
		<Skeleton class="mb-4 h-6 w-32 rounded" />
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
			{#each Array(4) as _, i}
				<Card class="p-4">
					<Skeleton class="mx-auto mb-2 h-4 w-16 rounded" />
					<Skeleton class="mx-auto h-5 w-12 rounded" />
				</Card>
			{/each}
		</div>
	</div>

	<Separator class="my-8" />

	<!-- Ingredients/Instructions Skeletons -->
	<div class="grid gap-8 md:grid-cols-2">
		<div>
			<Skeleton class="mb-4 h-6 w-40 rounded" />
			<div class="space-y-3">
				{#each Array(6) as _, i}
					<Skeleton class="h-5 w-full rounded" />
				{/each}
				<Skeleton class="h-5 w-2/3 rounded" />
			</div>
		</div>
		<div>
			<Skeleton class="mb-4 h-6 w-40 rounded" />
			<div class="space-y-4">
				{#each Array(5) as _, i}
					<div class="flex items-start gap-3">
						<Skeleton class="mt-1 h-6 w-6 rounded-full" />
						<div class="flex-1 space-y-2">
							<Skeleton class="h-5 w-full rounded" />
							<Skeleton class="h-5 w-4/5 rounded" />
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
