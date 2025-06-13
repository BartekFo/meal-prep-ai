<script lang="ts">
	let { children } = $props();
</script>

<div class="bg-background grid min-h-screen grid-cols-1 gap-4 p-4 md:grid-cols-2">
	{@render children()}
	<div
		class="bg-sidebar-accent relative hidden aspect-auto overflow-hidden rounded-lg shadow-md md:block"
	>
		<img
			src="/auth-background-food-boxes.jpg?height=600&width=600&text=Meal"
			alt="Meal prep"
			class="h-full w-full object-cover"
		/>
	</div>
</div>
