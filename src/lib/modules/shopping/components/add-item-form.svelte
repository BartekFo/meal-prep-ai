<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form/index';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select/index';
	import { Plus } from '@lucide/svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import type { IShoppingItemFormValues } from '../schema';

	const units = ['piece', 'kg', 'g', 'l', 'ml', 'serving', 'package', 'liter'] as const;

	type Props = {
		data: {
			form: SuperValidated<IShoppingItemFormValues>;
		};
	};

	const { data }: Props = $props();

	const form = superForm(data.form, {
		resetForm: true,
		taintedMessage: false,
		onUpdated: async ({ form: updatedForm }) => {
			if (updatedForm.valid) {
				await invalidateAll();
			}
		}
	});

	const { message, submitting, enhance, form: formData } = form;
</script>

<Card>
	<CardHeader>
		<CardTitle>Add Item</CardTitle>
	</CardHeader>
	<CardContent>
		<form method="POST" action="?/addItem" use:enhance class="space-y-4">
			{#if $message}
				<div class="rounded-md border border-green-500 bg-green-50 p-4 text-green-700">
					{$message}
				</div>
			{/if}

			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<div class="space-y-2">
							<Form.Label>Product Name</Form.Label>
							<Input
								{...props}
								bind:value={$formData.name}
								placeholder="e.g. Milk, Pepper, Chicken..."
								required
								disabled={$submitting}
							/>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="grid grid-cols-2 gap-4">
				<Form.Field {form} name="quantity">
					<Form.Control>
						{#snippet children({ props })}
							<div class="space-y-2">
								<Form.Label>Quantity</Form.Label>
								<Input
									{...props}
									bind:value={$formData.quantity}
									type="number"
									min="1"
									required
									disabled={$submitting}
								/>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="unit">
					<Form.Control>
						{#snippet children({ props })}
							<div class="space-y-2">
								<Form.Label>Unit</Form.Label>
								<Select.Root type="single" bind:value={$formData.unit} disabled={$submitting}>
									<Select.Trigger class="w-full" {...props}>
										{$formData.unit ?? 'Select unit'}
									</Select.Trigger>
									<Select.Content>
										{#each units as u (u)}
											<Select.Item value={u}>{u}</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>

			<Button type="submit" class="w-full" disabled={$submitting || !$formData.name.trim()}>
				<Plus class="mr-2 h-4 w-4" />
				{$submitting ? 'Adding...' : 'Add'}
			</Button>
		</form>
	</CardContent>
</Card>
