<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLSpanElement>;

	let { class: className, children, ...restProps }: Props = $props();
</script>

<span
	data-slot="input-group-text"
	class={cn('text-muted-foreground text-sm', className)}
	{...restProps}
>
	{@render children?.()}
</span>
