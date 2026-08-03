/**
 * Preprocessing module for OccurrenceGeoJob
 *
 * This module provides utilities for pre-processing occurrence data into
 * WebGL-ready GeoJSON with:
 * - Coordinates reprojected to EPSG:3857 (Web Mercator)
 * - Species colors pre-computed as normalized RGB values
 * - Presence/absence status pre-determined
 * - All filter-relevant attributes pre-extracted
 * - All WebGL shader attributes pre-set
 */

export {
  // Color utilities
  hexToNormalizedRgba,
  getSpeciesHexColor,
  getSpeciesRgba,
  getPresenceStatus,
  getBaseSize,
  type NormalizedRGB,
  type NormalizedRGBA,
} from './colors.js';

export {
  // Coordinate utilities
  setupCoordinates,
  initializeProjections,
  isValidCoordinate,
  reprojectToWebMercator,
  extractCoordinates,
  createWebMercatorPoint,
} from './coordinates.js';

export {
  // GeoJSON building
  createWebGLProperties,
  createWebGLFeature,
  createFeatureCollection,
  GeoJSONBuilder,
  createGeoJSONStreamProcessor,
  type WebGLFeatureProperties,
} from './geojsonBuilder.js';

export {
  // Occurrence data building
  OccurrenceBuilder,
  createOccurrenceStreamProcessor,
} from './occurrenceBuilder.js';

export {
  // Split layer builders (presence/absence)
  PresenceLayerBuilder,
  AbsenceLayerBuilder,
  createSplitLayerStreamProcessors,
  splitOccurrenceData,
  createSplitLayers,
} from './splitLayers.js';
