export interface African_countries_extents {
  [key: string]: number[];
}
export function getCombinedExtent(extents: number[][] | string): number[] {
  if (extents.length === 0) {
    return [];
  }
  if (typeof extents === 'string') return [];

  const minX = Math.min(...extents.map((extent) => extent[0]));
  const minY = Math.min(...extents.map((extent) => extent[1]));
  const maxX = Math.max(...extents.map((extent) => extent[2]));
  const maxY = Math.max(...extents.map((extent) => extent[3]));

  return [minX, minY, maxX, maxY];
}

export function matchObjectKeys(
  search: any[],
  obj: African_countries_extents
): number[][] {
  const matchingValues: number[][] = [];
  const keys = Object.keys(obj);
  for (const key of keys) {
    for (const term of search) {
      if (key.toLowerCase().includes(term.toLowerCase())) {
        matchingValues.push(obj[key]);
        break;
      }
    }
  }
  return matchingValues;
}
