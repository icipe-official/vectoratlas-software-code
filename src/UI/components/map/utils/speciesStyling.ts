// state/map/utils/speciesStyling.ts

// Dominant species agreed with scientists
export const DOMINANT_SPECIES = [
  'arabiensis',
  'funestus',
  'funestus complex',
  'gambiae complex',
  'gambiae_s form',
  'coluzzii_gambiae_m form',
  'stephensi',
];

// Bright palette (high salience)
export const DOMINANT_COLORS = [
  '#e53935', // red
  '#1e88e5', // blue
  '#43a047', // green
  '#fb8c00', // orange
  '#8e24aa', // purple
  '#00acc1', // cyan
  '#fdd835', // yellow
];

// Muted palette (low salience)
export const SECONDARY_COLORS = [
  '#b0bec5',
  '#90a4ae',
  '#a5d6a7',
  '#ffe0b2',
  '#d1c4e9',
  '#cfd8dc',
  '#bcaaa4',
  '#e0e0e0',
];

// Utility: clean species name
export function normalizeSpeciesName(name: string): string {
  return name
    .replace(/^An\.\s?/, '') // remove "An."
    .toLowerCase()
    .trim();
}

// Main resolver used everywhere
export function getSpeciesColor(speciesName: string): string {
  const clean = normalizeSpeciesName(speciesName);

  // Dominant → bright
  if (DOMINANT_SPECIES.includes(clean)) {
    const index = DOMINANT_SPECIES.indexOf(clean);
    return DOMINANT_COLORS[index % DOMINANT_COLORS.length];
  }

  // Secondary → deterministic muted colour (ES5 safe)
  const hash = clean
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  return SECONDARY_COLORS[hash % SECONDARY_COLORS.length];
}

// Size / symbol logic
export function isDominantSpecies(name: string): boolean {
  return DOMINANT_SPECIES.includes(normalizeSpeciesName(name));
}
