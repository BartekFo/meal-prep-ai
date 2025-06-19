<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';

	interface Props {
		children: any;
	}

	let { children }: Props = $props();
</script>

<Card>
	<CardContent class="flex flex-col gap-5">
		{@render children()}
	</CardContent>
</Card>
