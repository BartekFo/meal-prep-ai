<script lang="ts">
	import { cn } from '$lib/utils';

	interface NutritionItemProps {
		value: number | string;
		label: string;
		unit?: string;
		variant?: 'large' | 'compact';
	}

	let { value, label, unit = '', variant = 'large' }: NutritionItemProps = $props();

	const isLarge = $derived(variant === 'large');
</script>

<div class="not-prose text-center">
	<p class={isLarge ? 'text-2xl font-bold' : 'text-sm font-medium'}>
		{value}{unit}
	</p>
	<p class={cn('text-muted-foreground', isLarge ? 'text-sm' : 'text-xs')}>
		{label}
	</p>
</div>
