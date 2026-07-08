/**
 * GeoJSON builder for preprocessing occurrence data
 *
 * Creates GeoJSON features with all WebGL-ready attributes
 */

import type { FeatureCollection, Feature, Geometry } from 'geojson';
import type { OccurrenceData } from '@/types/index.js';
import {
  hexToNormalizedRgba,
  getSpeciesHexColor,
  getPresenceStatus,
  getBaseSize,
} from './colors.js';
import { extractCoordinates, createWebMercatorPoint } from './coordinates.js';
import { logger } from '@/utils/index.js';

/**
 * WebGL-ready properties for a GeoJSON feature
 */
export interface WebGLFeatureProperties {
  // Original data
  id: string;
  species: string | undefined;
  binary_presence: string | undefined;
  country: string;
  year_start: number | undefined;
  has_adult: boolean | undefined;
  has_larval: boolean | undefined;
  season_val: string | undefined;
  insecticide: string | undefined;
  abundance_data: string | undefined;
  bio_data: string | undefined;
  is_presence: boolean | undefined;
  has_abundance: boolean | undefined;
  has_bionomics: boolean | undefined;
  // Epoch timestamp for time filtering, defaults to 0
  year_start_epoch: number;

  // Color attributes (normalized 0-1)
  r: number;
  g: number;
  b: number;
  a: number;

  // Presence/Absence
  presenceStatus: 'presence' | 'absence' | 'unknown';
  isPresence: 0 | 1;
  isAbsence: 0 | 1;
  baseSize: number;

  // Filter attributes
  species_normalized: string;
  country_normalized: string;
  year: number | undefined;
  has_adult_int: 0 | 1;
  has_larval_int: 0 | 1;
  has_bionomics_int: 0 | 1;
  has_abundance_int: 0 | 1;
  season_val_filter: string;

  // GPU attributes
  gpuVisible: 0 | 1;
  selected: 0 | 1;
  highlight: -1 | 0 | 1;
  zBoost: number;
}

/**
 * Create WebGL-ready properties from OccurrenceData
 * @param data - Occurrence data
 * @returns WebGL feature properties
 */
export function createWebGLProperties(
  data: OccurrenceData,
): WebGLFeatureProperties {
  const species = data.species ?? '';
  const country = data.country ?? '';
  const binaryPresence = data.binary_presence ?? '';

  // Get species color
  const hexColor = getSpeciesHexColor(species);
  const [r, g, b, a] = hexToNormalizedRgba(hexColor);

  // Presence status
  const presenceStatus = getPresenceStatus(binaryPresence);
  const isPresence = presenceStatus === 'presence' ? 1 : 0;
  const isAbsence = presenceStatus === 'absence' ? 1 : 0;

  // Base size based on presence
  const baseSize = getBaseSize(presenceStatus);

  // Filter attributes
  const year = data.year_start;

  return {
    // Original data
    id: data.id,
    species,
    binary_presence: binaryPresence,
    country,
    year_start: year,
    has_adult: data.has_adult,
    has_larval: data.has_larval,
    season_val: data.season_val,
    insecticide: data.insecticide,
    abundance_data: data.abundance_data,
    bio_data: data.bio_data,
    is_presence: data.is_presence,
    has_abundance: data.has_abundance,
    has_bionomics: data.has_bionomics,
    year_start_epoch: data.year_start_epoch,

    // Color attributes (normalized 0-1)
    r,
    g,
    b,
    a,

    // Presence/Absence
    presenceStatus,
    isPresence,
    isAbsence,
    baseSize,

    // Filter attributes
    species_normalized: species.toLowerCase().trim(),
    country_normalized: country.toLowerCase().trim(),
    year,
    has_adult_int: data.has_adult ? 1 : 0,
    has_larval_int: data.has_larval ? 1 : 0,
    has_bionomics_int: data.has_bionomics ? 1 : 0,
    has_abundance_int: data.has_abundance ? 1 : 0,
    season_val_filter: data.season_val ?? '',

    // GPU attributes
    gpuVisible: 1,
    selected: 0,
    highlight: 0,
    zBoost: 0,
  };
}

/**
 * Create a GeoJSON feature from OccurrenceData with WebGL properties
 * @param data - Occurrence data
 * @returns GeoJSON Feature with WebGL properties
 */
export function createWebGLFeature(
  data: OccurrenceData,
): Feature<Geometry, WebGLFeatureProperties> {
  const properties = createWebGLProperties(data);

  // Extract and reproject coordinates
  const coords = extractCoordinates(data.location);

  if (!coords) {
    logger.warn(
      `Invalid or missing location for occurrence ${data.id}, using [0, 0]`,
    );
    return {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [0, 0] },
      properties,
    };
  }

  // Coordinates are now in correct [Lon, Lat] order from SQL
  const [lon, lat] = coords;

  // Create Web Mercator geometry
  const geometry = createWebMercatorPoint(lon, lat);

  return {
    type: 'Feature',
    geometry,
    properties,
  };
}

/**
 * Create a GeoJSON FeatureCollection from an array of OccurrenceData
 * @param data - Array of occurrence data
 * @returns GeoJSON FeatureCollection
 */
export function createFeatureCollection(
  data: OccurrenceData[],
): FeatureCollection<Geometry, WebGLFeatureProperties> {
  const features = data.map(createWebGLFeature);

  logger.info(
    `Created GeoJSON FeatureCollection with ${features.length} features`,
  );

  return {
    type: 'FeatureCollection',
    //@ts-expect-error adding custom properties
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:EPSG::3857',
      },
    },
    features,
  };
}

/**
 * Class for building GeoJSON with streaming support
 */
export class GeoJSONBuilder {
  private features: Feature<Geometry, WebGLFeatureProperties>[] = [];
  private processedCount = 0;

  /**
   * Add a single OccurrenceData to the builder
   * @param data - Occurrence data
   */
  add(data: OccurrenceData): void {
    this.features.push(createWebGLFeature(data));
    this.processedCount++;

    if (this.processedCount % 1000 === 0) {
      logger.debug(`Processed ${this.processedCount} features for GeoJSON`);
    }
  }

  /**
   * Add multiple OccurrenceData items
   * @param data - Array of occurrence data
   */
  addBatch(data: OccurrenceData[]): void {
    data.forEach((d) => this.add(d));
  }

  /**
   * Get the current count of features
   */
  get count(): number {
    return this.features.length;
  }

  /**
   * Build and return the final GeoJSON FeatureCollection
   * @returns GeoJSON FeatureCollection
   */
  build(): FeatureCollection<Geometry, WebGLFeatureProperties> {
    logger.info(`Finalizing GeoJSON with ${this.features.length} features`);

    return {
      type: 'FeatureCollection',
      // @ts-expect-error adding custom properties
      crs: {
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:EPSG::3857',
        },
      },
      features: this.features,
    };
  }

  /**
   * Reset the builder for reuse
   */
  reset(): void {
    this.features = [];
    this.processedCount = 0;
  }
}

/**
 * Create a stream processor that builds GeoJSON incrementally
 * @returns Function that processes batches of OccurrenceData
 */
export function createGeoJSONStreamProcessor() {
  const builder = new GeoJSONBuilder();

  return {
    builder,
    processBatch: (batch: OccurrenceData[], batchNumber: number) => {
      logger.debug(
        `Processing batch ${batchNumber} with ${batch.length} items`,
      );
      builder.addBatch(batch);
    },
    getResult: () => builder.build(),
  };
}
