import { z } from 'zod';

export const ShoppingItemFormSchema = z.object({
	name: z.string().min(1),
	quantity: z.number().min(1),
	unit: z.enum(['piece', 'kg', 'g', 'l', 'ml', 'serving', 'package', 'liter'])
});

export type IShoppingItemFormValues = z.infer<typeof ShoppingItemFormSchema>;
