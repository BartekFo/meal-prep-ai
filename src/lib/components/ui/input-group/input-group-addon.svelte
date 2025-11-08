<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { tv, type VariantProps } from 'tailwind-variants';

	const addonVariants = tv({
		base: 'flex items-center gap-2',
		variants: {
			align: {
				'inline-start': 'flex-row',
				'inline-end': 'flex-row',
				'block-start': 'flex-row',
				'block-end': 'flex-row justify-end'
			}
		},
		defaultVariants: {
			align: 'inline-start'
		}
	});

	type Props = HTMLAttributes<HTMLDivElement> & VariantProps<typeof addonVariants>;

	let { class: className, align, children, ...restProps }: Props = $props();
</script>

<div data-slot="input-group-addon" class={cn(addonVariants({ align }), className)} {...restProps}>
	{@render children?.()}
</div>
