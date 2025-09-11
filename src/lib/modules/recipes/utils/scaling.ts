/**
 * Simple ingredient scaling utility for recipe portion adjustments
 * Handles basic cases like "2 cups", "1/2 tsp", "3-4 items"
 */

// Hoisted regex to top-level per lint rule for performance
const NUMERIC_QUANTITY_REGEX = /\b(\d+(?:\.\d+)?(?:\/\d+)?|\d+-\d+)\b/g;

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

function scaleRange(match: string, multiplier: number): string {
  const parts = match.split('-').map(Number);
  if (parts.length !== 2 || parts[0] === undefined || parts[1] === undefined) {
    return match;
  }
  const [start, end] = parts;
  const scaledStart = roundToTwoDecimals(start * multiplier);
  const scaledEnd = roundToTwoDecimals(end * multiplier);
  return `${scaledStart}-${scaledEnd}`;
}

function convertToCommonFraction(scaled: number): string | null {
  if (scaled === 0.25) {
    return '1/4';
  }
  if (scaled === 0.33 || Math.abs(scaled - 1 / 3) < 0.01) {
    return '1/3';
  }
  if (scaled === 0.5) {
    return '1/2';
  }
  if (scaled === 0.67 || Math.abs(scaled - 2 / 3) < 0.01) {
    return '2/3';
  }
  if (scaled === 0.75) {
    return '3/4';
  }
  return null;
}

function scaleFraction(match: string, multiplier: number): string {
  const parts = match.split('/').map(Number);
  if (parts.length !== 2 || parts[0] === undefined || parts[1] === undefined) {
    return match;
  }
  const [numerator, denominator] = parts;
  const decimal = numerator / denominator;
  const scaled = decimal * multiplier;

  const commonFraction = convertToCommonFraction(scaled);
  return commonFraction ?? roundToTwoDecimals(scaled).toString();
}

function scaleNumber(match: string, multiplier: number): string {
  const num = Number.parseFloat(match);
  const scaled = num * multiplier;
  return roundToTwoDecimals(scaled).toString();
}

function scaleNumericMatch(match: string, multiplier: number): string {
  if (match.includes('-')) {
    return scaleRange(match, multiplier);
  }
  if (match.includes('/')) {
    return scaleFraction(match, multiplier);
  }
  return scaleNumber(match, multiplier);
}

export function scaleIngredient(
  ingredient: string,
  multiplier: number
): string {
  if (multiplier <= 0 || multiplier === 1) {
    return ingredient;
  }

  return ingredient.replace(NUMERIC_QUANTITY_REGEX, (match) =>
    scaleNumericMatch(match, multiplier)
  );
}
