<script lang="ts">
	import { MessageSquare } from '@lucide/svelte';

	type Props = {
		prompts: string[];
		onPromptClick: (prompt: string) => void;
	};

	let { prompts, onPromptClick }: Props = $props();
</script>

<div class="space-y-4">
	<p class="text-muted-foreground text-center text-sm">
		Try one of these suggestions to get started:
	</p>
	<div class="grid gap-3 sm:grid-cols-2">
		{#each prompts as prompt (prompt)}
			<button
				type="button"
				onclick={() => onPromptClick(prompt)}
				class="bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground group rounded-lg border p-4 text-left text-sm transition-colors"
			>
				<div class="flex items-start gap-3">
					<MessageSquare
						class="text-muted-foreground group-hover:text-accent-foreground mt-0.5 size-4 shrink-0"
					/>
					<span>{prompt}</span>
				</div>
			</button>
		{/each}
	</div>
</div>
