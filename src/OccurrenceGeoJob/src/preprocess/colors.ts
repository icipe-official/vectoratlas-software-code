/**
 * Color utilities for preprocessing occurrence data
 *
 * Converts hex colors to normalized RGB values for WebGL
 */

import { SPECIES_COLOR_MAP, GENERIC_GREEN } from '@/types/index.js';
import { logger } from '@/utils/index.js';

/**
 * Normalized RGB color tuple [r, g, b] with values in 0-1 range
 */
export type NormalizedRGB = [number, number, number];

/**
 * Normalized RGBA color tuple [r, g, b, a] with values in 0-1 range
 */
export type NormalizedRGBA = [number, number, number, number];

/**
 * Convert hex color string to normalized RGBA array
 * @param color - Hex color string (e.g., '#RRGGBB' or '#RGB')
 * @param alpha - Alpha value (default: 1.0)
 * @returns Normalized RGBA array [r, g, b, a] with values in 0-1 range
 */
export function hexToNormalizedRgba(
  color: string | undefined,
  alpha: number = 1.0,
): NormalizedRGBA {
  if (!color) {
    logger.debug('No color provided, using default');
    return [0, 0.5, 0.2, 1];
  }

  let r = 0,
    g = 0,
    b = 0;

  const hex = color.trim();

  if (hex.startsWith('#')) {
    const hexStr = hex.slice(1);
    if (hexStr.length === 6) {
      r = parseInt(hexStr.substring(0, 2), 16);
      g = parseInt(hexStr.substring(2, 4), 16);
      b = parseInt(hexStr.substring(4, 6), 16);
    } else if (hexStr.length === 3) {
      // TypeScript needs help with string indexing - use substring instead
      r = parseInt(hexStr.substring(0, 1) + hexStr.substring(0, 1), 16);
      g = parseInt(hexStr.substring(1, 2) + hexStr.substring(1, 2), 16);
      b = parseInt(hexStr.substring(2, 3) + hexStr.substring(2, 3), 16);
    }
  }

  return [r / 255, g / 255, b / 255, alpha];
}

/**
 * Get color for a species from the species color map
 * @param species - Species name
 * @returns Hex color string
 */
export function getSpeciesHexColor(species: string | undefined): string {
  if (!species) {
    return GENERIC_GREEN;
  }

  const normalizedSpecies = species.toLowerCase().trim();

  // Check direct match first
  if (SPECIES_COLOR_MAP[normalizedSpecies]) {
    return SPECIES_COLOR_MAP[normalizedSpecies];
  }

  // Try to find partial match (for cases like "gambiae complex" vs "gambiae")
  for (const [key, color] of Object.entries(SPECIES_COLOR_MAP)) {
    if (normalizedSpecies.includes(key.toLowerCase())) {
      logger.debug(
        `Found partial color match for species "${species}": ${key} -> ${color}`,
      );
      return color;
    }
  }

  logger.debug(
    `No color match found for species "${species}", using generic green`,
  );
  return GENERIC_GREEN;
}

/**
 * Get normalized RGBA color for a species
 * @param species - Species name
 * @param alpha - Alpha value (default: 1.0)
 * @returns Normalized RGBA array
 */
export function getSpeciesRgba(
  species: string | undefined,
  alpha: number = 1.0,
): NormalizedRGBA {
  const hexColor = getSpeciesHexColor(species);
  return hexToNormalizedRgba(hexColor, alpha);
}

/**
 * Determine presence status from binary_presence value
 * @param binaryPresence - The binary_presence value
 * @returns 'presence' | 'absence' | 'unknown'
 */
export function getPresenceStatus(
  binaryPresence: string | undefined,
): 'presence' | 'absence' | 'unknown' {
  if (!binaryPresence) {
    return 'unknown';
  }

  const value = String(binaryPresence).toLowerCase().trim();

  if (
    value === '1' ||
    value === 'true' ||
    value === 'presence' ||
    value === 'present'
  ) {
    return 'presence';
  }

  if (
    value === '0' ||
    value === 'false' ||
    value === 'absence' ||
    value === 'absent'
  ) {
    return 'absence';
  }

  return 'unknown';
}

/**
 * Get the base size for a feature based on presence status
 * @param presenceStatus - The presence status
 * @returns Base size (9 for both presence and absence)
 */
export function getBaseSize(
  presenceStatus: 'presence' | 'absence' | 'unknown',
): number {
  if (presenceStatus === 'absence') {
    return 9;
  }
  return 9;
}
