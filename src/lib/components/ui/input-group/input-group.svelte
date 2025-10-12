<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement>;

	let { class: className, children, ...restProps }: Props = $props();
</script>

<div
	data-slot="input-group"
	class={cn('relative flex w-full flex-col gap-2', className)}
	{...restProps}
>
	{@render children?.()}
</div>
