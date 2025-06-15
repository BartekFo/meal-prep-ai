<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Search } from '@lucide/svelte';
	import { goto, pushState } from '$app/navigation';
	import { page } from '$app/state';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';

	let searchQuery = page.url.searchParams.get('search');

	function handleSearchInput(e: Event) {
		const target = e.target as HTMLInputElement;
		goto(`?search=${target.value}`);
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
		<Select type="single">
			<SelectTrigger class="w-[140px]"></SelectTrigger>
			<SelectContent>
				<SelectItem value="all">All Types</SelectItem>
				<SelectItem value="breakfast">Breakfast</SelectItem>
				<SelectItem value="lunch">Lunch</SelectItem>
				<SelectItem value="dinner">Dinner</SelectItem>
				<SelectItem value="snack">Snack</SelectItem>
			</SelectContent>
		</Select>
		<Select type="single">
			<SelectTrigger class="w-[140px]"></SelectTrigger>
			<SelectContent>
				<SelectItem value="newest">Newest</SelectItem>
				<SelectItem value="oldest">Oldest</SelectItem>
				<SelectItem value="a-z">A-Z</SelectItem>
				<SelectItem value="z-a">Z-A</SelectItem>
			</SelectContent>
		</Select>
	</div>
</div>
