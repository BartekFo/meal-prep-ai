<script lang="ts">
	import { ImagePlus, X } from '@lucide/svelte';

	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { cn } from '$lib/utils';

	const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

	interface IImageUploadProps {
		value: File | undefined;
		onchange: (file?: File) => void;
		name: string;
	}

	let { value, onchange, name }: IImageUploadProps = $props();
	let error = $state<string | null>(null);
	let previewUrl = $state<string | null>(null);
	let isFileVisible = $derived(value && previewUrl);
	let input: HTMLInputElement;

	function clearPreviewUrl() {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		previewUrl = null;
	}

	function handleImageUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		error = null;

		if (!file) return;

		if (!file.type.startsWith('image/')) {
			error = 'File must be an image';
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			error = 'File size must be less than 2MB';
			return;
		}

		const url = URL.createObjectURL(file);
		previewUrl = url;

		onchange(file);
	}

	function handleRemoveImage() {
		onchange(undefined);
		input.value = '';
		clearPreviewUrl();
		error = null;
	}
</script>

<div>
	{#if error}<div class="text-destructive mb-2 text-sm">{error}</div>{/if}

	<Card class={cn('relative', !isFileVisible && 'hidden')}>
		<CardContent class="p-0">
			{#if value && previewUrl}
				<div class="relative aspect-video w-full overflow-hidden rounded-md px-4">
					<img src={previewUrl} alt="Preview" class="h-full w-full object-cover" />
				</div>
			{/if}

			<Button
				type="button"
				variant="destructive"
				size="icon"
				class="absolute top-2 right-2"
				onclick={handleRemoveImage}
			>
				<X className="h-4 w-4" />
				<span class="sr-only">Remove image</span>
			</Button>
			<div class="text-muted-foreground p-4 pt-10 text-center text-sm">
				{value?.name}
			</div>
		</CardContent>
	</Card>
	<Card class={cn('border-dashed', isFileVisible && 'hidden')}>
		<CardContent class="flex flex-col items-center justify-center p-6">
			<label
				for="image"
				class="flex w-full cursor-pointer flex-col items-center justify-center gap-2"
			>
				<div class="bg-muted rounded-full p-2">
					<ImagePlus className="h-6 w-6" />
				</div>
				<span class="text-muted-foreground text-xs"> SVG, PNG, JPG (max. 2MB) </span>

				<input
					class="hidden"
					id={name}
					bind:this={input}
					type="file"
					{name}
					accept="image/*"
					onchange={handleImageUpload}
				/>
			</label>
		</CardContent>
	</Card>
</div>
