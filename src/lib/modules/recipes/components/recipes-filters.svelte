<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Search } from '@lucide/svelte';
	import { goto, pushState } from '$app/navigation';
	import { page } from '$app/state';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { MEAL_TYPES } from '$lib/constants/meal-types';

	let searchQuery = page.url.searchParams.get('search');
	let recipeType = page.url.searchParams.get('type') || 'all';
	let sortBy = page.url.searchParams.get('sort') || 'newest';

	function handleSearchInput(e: Event) {
		const target = e.target as HTMLInputElement;
		goto(`?search=${target.value}`);
	}

	function handleTypeChange(value: string) {
		goto(`?type=${value}`);
	}

	function handleSortChange(value: string) {
		goto(`?sort=${value}`);
	}
</script>

<div class="mb-6 flex flex-col gap-4 sm:flex-row">
	<div class="relative flex-1">
		<Search class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
		<Input
			placeholder="Search recipes..."
			class="pl-9"
			value={searchQuery}
			onchange={handleSearchInput}
		/>
	</div>
	<div class="flex gap-2">
		<Select type="single" value={recipeType} onValueChange={handleTypeChange}>
			<SelectTrigger class="w-36 capitalize">
				{recipeType === 'all' ? 'All Types' : recipeType}
			</SelectTrigger>
			<SelectContent>
				{#each MEAL_TYPES as type}
					<SelectItem value={type}>{type}</SelectItem>
				{/each}
			</SelectContent>
		</Select>
		<Select type="single" value={sortBy} onValueChange={handleSortChange}>
			<SelectTrigger class="w-36 capitalize">
				{sortBy}
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="newest">Newest</SelectItem>
				<SelectItem value="oldest">Oldest</SelectItem>
				<SelectItem value="a-z">A-Z</SelectItem>
				<SelectItem value="z-a">Z-A</SelectItem>
			</SelectContent>
		</Select>
	</div>
</div>
