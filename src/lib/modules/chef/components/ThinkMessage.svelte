<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Sparkles } from '@lucide/svelte';

	const role = 'assistant';
</script>

<div
	class="group/message w-full"
	data-role={role}
	data-testid="message-assistant-loading"
	in:fade={{ duration: 200 }}
	out:fade={{ duration: 500 }}
>
	<div class="flex items-start justify-start gap-3">
		<div
			class="-mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border"
		>
			<Sparkles size={14} />
		</div>

		<div class="flex w-full flex-col gap-2 md:gap-4">
			<div class="p-0 text-sm text-muted-foreground">Thinking...</div>
		</div>
	</div>
</div>
