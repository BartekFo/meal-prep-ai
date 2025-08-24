/**
 * Simple ingredient scaling utility for recipe portion adjustments
 * Handles basic cases like "2 cups", "1/2 tsp", "3-4 items"
 */

export function scaleIngredient(ingredient: string, multiplier: number): string {
	if (multiplier <= 0) return ingredient;
	if (multiplier === 1) return ingredient;

	return ingredient.replace(/\b(\d+(?:\.\d+)?(?:\/\d+)?|\d+-\d+)\b/g, (match) => {
		// Handle ranges like "3-4"
		if (match.includes('-')) {
			const [start, end] = match.split('-').map(Number);
			const scaledStart = Math.round(start * multiplier * 100) / 100;
			const scaledEnd = Math.round(end * multiplier * 100) / 100;
			return `${scaledStart}-${scaledEnd}`;
		}

		// Handle fractions like "1/2"
		if (match.includes('/')) {
			const [numerator, denominator] = match.split('/').map(Number);
			const decimal = numerator / denominator;
			const scaled = decimal * multiplier;

			// Convert back to fraction if it results in a simple fraction
			if (scaled === 0.25) return '1/4';
			if (scaled === 0.33 || Math.abs(scaled - 1 / 3) < 0.01) return '1/3';
			if (scaled === 0.5) return '1/2';
			if (scaled === 0.67 || Math.abs(scaled - 2 / 3) < 0.01) return '2/3';
			if (scaled === 0.75) return '3/4';

			// Otherwise return decimal rounded to 2 places
			return (Math.round(scaled * 100) / 100).toString();
		}

		// Handle regular numbers
		const num = parseFloat(match);
		const scaled = num * multiplier;
		return (Math.round(scaled * 100) / 100).toString();
	});
}
