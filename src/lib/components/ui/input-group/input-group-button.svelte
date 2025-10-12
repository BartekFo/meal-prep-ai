<script lang="ts">
	import { Button, buttonVariants, type ButtonProps } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';

	type Props = ButtonProps;

	let {
		ref = $bindable(null),
		class: className,
		variant = 'outline',
		size = 'default',
		children,
		...restProps
	}: Props = $props();
</script>

<Button
	bind:ref
	data-slot="input-group-button"
	class={cn(buttonVariants({ variant, size }), className)}
	{variant}
	{size}
	{...restProps}
>
	{@render children?.()}
</Button>
