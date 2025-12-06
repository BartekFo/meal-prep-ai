import { tool } from 'ai';
import z from 'zod';
import { getFridgeItemsWithExpiry } from '$lib/modules/shopping';

export function createFridgeContentsTool(userId: string) {
	return tool({
		description: 'Get contents of user fridge to suggest recipes based on available ingredients',
		inputSchema: z.object({}).describe('No input parameters required'),
		execute: async () => {
			try {
				const items = await getFridgeItemsWithExpiry(userId);

				const itemsList = items
					.map((item) => {
						let status = '';
						if (item.expiryStatus === 'expired') {
							status = ' (PRZETERMINOWANY)';
						} else if (item.expiryStatus === 'expiring') {
							status = ' (WKRÓTCE PRZETERMINUJE)';
						}
						return `${item.name} (${item.quantity} ${item.unit})${status}`;
					})
					.join('\n');

				return {
					items,
					count: items.length,
					itemsList: itemsList || 'Lodówka jest pusta'
				};
			} catch (error) {
				console.error('Error fetching fridge contents:', error);
				return {
					items: [],
					count: 0,
					itemsList: 'Nie udało się pobrać zawartości lodówki'
				};
			}
		}
	});
}
