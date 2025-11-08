<script lang="ts">
	import { ArrowUp } from '@lucide/svelte';
	import * as InputGroup from '$lib/components/ui/input-group';

	type Props = {
		value: string;
		disabled?: boolean;
		onSubmit: (event: SubmitEvent) => void;
	};

	let { value = $bindable(), disabled = false, onSubmit }: Props = $props();
</script>

<div class="border-t px-6 py-4">
	<div class="mx-auto max-w-4xl">
		<form onsubmit={onSubmit}>
			<InputGroup.Root>
				<InputGroup.Textarea
					placeholder="Ask, Search or Chat..."
					bind:value
					rows={1}
					class="max-h-32 min-h-[2.5rem] resize-none"
				/>
				<InputGroup.Addon align="block-end">
					<InputGroup.Button
						variant="default"
						class="size-7 rounded-full"
						size="icon"
						disabled={disabled || !value.trim()}
						type="submit"
					>
						<ArrowUp class="size-4" />
						<span class="sr-only">Send</span>
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</form>
	</div>
</div>
