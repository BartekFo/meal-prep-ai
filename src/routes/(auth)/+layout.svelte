<script lang="ts">
const { children } = $props();

import authBackgroundFoodBoxes from '$lib/assets/auth-background-food-boxes.jpg?enhanced';
</script>

<div class="bg-background grid min-h-screen grid-cols-1 gap-4 p-4 md:grid-cols-2">
	{@render children()}
	<div
		class="bg-sidebar-accent relative hidden aspect-auto max-h-[calc(100vh-2rem))] overflow-hidden rounded-lg shadow-md md:block"
	>
		<enhanced:img
			src={authBackgroundFoodBoxes}
			alt="Meal prep"
			class="h-full w-full object-cover"
		/>
	</div>
</div>
