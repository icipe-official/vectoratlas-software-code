/**
 * Coordinate transformation utilities for preprocessing occurrence data
 *
 * Uses OpenLayers for coordinate reprojection between EPSG:4326 (WGS84) and EPSG:3857 (Web Mercator)
 */

import { register } from 'ol/proj/proj4.js';
import { transform } from 'ol/proj.js';
import proj4 from 'proj4';
import { logger } from '@/utils/index.js';
import type { Geometry } from 'geojson';

/**
 * Initialize coordinate systems
 * Sets up proj4 definitions for EPSG:4326 and EPSG:3857
 */
export function initializeProjections(): void {
  // EPSG:4326 - WGS84 (lat/lon)
  proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs +type=crs');

  // EPSG:3857 - Web Mercator
  proj4.defs(
    'EPSG:3857',
    '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@nullwgs84,urn:x-ogc:def:crs:EPSG:6.18.3:3857 +no_defs +type=crs',
  );

  // Register projections with OpenLayers
  register(proj4);

  logger.debug('Coordinate projections initialized');
}

/**
 * Check if a coordinate array is valid
 * @param coords - Coordinate array [longitude, latitude]
 * @returns true if valid, false otherwise
 */
export function isValidCoordinate(coords: [number, number] | undefined) {
  if (!coords || coords.length !== 2) {
    return false;
  }

  const [lon, lat] = coords;

  // Check for NaN or infinite values
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
    return false;
  }

  // Basic bounds check for WGS84
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return false;
  }

  return true;
}

/**
 * Reproject coordinates from EPSG:4326 (WGS84) to EPSG:3857 (Web Mercator)
 * @param lon - Longitude in EPSG:4326
 * @param lat - Latitude in EPSG:4326
 * @returns [x, y] coordinates in EPSG:3857, or [0, 0] if invalid
 */
export function reprojectToWebMercator(
  lon: number,
  lat: number,
): [number, number] {
  try {
    if (!isValidCoordinate([lon, lat])) {
      logger.warn(`Invalid coordinates (${lon}, ${lat}), returning [0, 0]`);
      return [0, 0];
    }

    const result = transform([lon, lat], 'EPSG:4326', 'EPSG:3857');

    if (!result || result.length !== 2) {
      logger.warn(
        `Failed to reproject coordinates (${lon}, ${lat}), returning [0, 0]`,
      );
      return [0, 0];
    }

    return result as [number, number];
  } catch (err) {
    logger.error(`Error reprojecting coordinates (${lon}, ${lat}): %O`, err);
    return [0, 0];
  }
}

/**
 * Extract coordinates from a GeoJSON Point geometry
 * @param geometry - GeoJSON Point geometry
 * @returns [longitude, latitude] in EPSG:4326, or undefined if invalid
 */
export function extractCoordinates(
  geometry: Geometry | undefined,
): [number, number] | undefined {
  if (!geometry || geometry.type !== 'Point') {
    return undefined;
  }

  const coords = geometry.coordinates;

  if (!isValidCoordinate(coords as [number, number])) {
    return undefined;
  }

  return coords as [number, number];
}

/**
 * Create a GeoJSON Point with reprojected coordinates
 * @param lon - Longitude in EPSG:4326
 * @param lat - Latitude in EPSG:4326
 * @returns GeoJSON Point with EPSG:3857 coordinates
 */
export function createWebMercatorPoint(lon: number, lat: number): Geometry {
  const [x, y] = reprojectToWebMercator(lon, lat);
  return {
    type: 'Point',
    coordinates: [x, y],
  };
}

/**
 * Initialize coordinate projections
 * Must be called once before using reprojection functions
 */
export function setupCoordinates(): void {
  initializeProjections();
}
