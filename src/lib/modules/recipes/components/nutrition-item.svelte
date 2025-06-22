<script lang="ts">
	interface NutritionItemProps {
		value: number | string;
		label: string;
		unit?: string;
		variant?: 'large' | 'compact';
	}

	let { value, label, unit = '', variant = 'large' }: NutritionItemProps = $props();

	const isLarge = $derived(variant === 'large');
	const isCompact = $derived(variant === 'compact');
</script>

<div class={isCompact ? 'prose text-center' : ''}>
	<p class={isLarge ? 'text-2xl font-bold' : 'text-sm font-medium'}>
		{value}{unit}
	</p>
	<p class={isLarge ? 'text-muted-foreground text-sm' : 'text-muted-foreground text-xs'}>
		{label}
	</p>
</div>
