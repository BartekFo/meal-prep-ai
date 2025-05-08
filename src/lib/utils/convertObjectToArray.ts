export function convertObjectToArray<T>(obj: Record<string, T>): T[] {
  const keys = Object.keys(obj);
  const isObjectArray =
    keys.length > 0 &&
    keys.every((key) => !Number.isNaN(Number(key))) &&
    keys.every((key) => obj[key] !== undefined);

  if (isObjectArray) {
    return keys.sort((a, b) => Number(a) - Number(b)).map((key) => obj[key]);
  }

  return [] as T[];
}
