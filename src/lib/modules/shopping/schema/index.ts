import { type } from 'arktype';

export const ShoppingItemFormSchema = type({
	name: 'string >= 1',
	quantity: 'number >= 1',
	unit: "'piece' | 'kg' | 'g' | 'l' | 'ml' | 'serving' | 'package' | 'liter'"
});

export type IShoppingItemFormValues = typeof ShoppingItemFormSchema.infer;
