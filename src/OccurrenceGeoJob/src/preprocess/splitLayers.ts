/**
 * Split layer builders for creating separate presence and absence GeoJSON layers
 */

import type { FeatureCollection, Feature, Geometry } from 'geojson';
import type { OccurrenceData } from '@/types/index.js';
import type { WebGLFeatureProperties } from './geojsonBuilder.js';
import { createWebGLFeature } from './geojsonBuilder.js';
import { getPresenceStatus } from './colors.js';
import { logger } from '@/utils/index.js';

/**
 * Builder for presence-only GeoJSON layer
 */
export class PresenceLayerBuilder {
  private features: Feature<Geometry, WebGLFeatureProperties>[] = [];
  private processedCount = 0;

  /**
   * Add occurrence data if it's a presence
   * @param data - Occurrence data
   */
  add(data: OccurrenceData): void {
    const presenceStatus = getPresenceStatus(data.binary_presence);
    if (presenceStatus !== 'presence') {
      return; // Skip non-presence
    }

    this.features.push(createWebGLFeature(data));
    this.processedCount++;

    if (this.processedCount % 1000 === 0) {
      logger.debug(
        `PresenceLayerBuilder: Processed ${this.processedCount} presence features`,
      );
    }
  }

  /**
   * Add multiple occurrence data items
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
   * Build and return the presence-only GeoJSON FeatureCollection
   * @returns GeoJSON FeatureCollection
   */
  build(): FeatureCollection<Geometry, WebGLFeatureProperties> {
    logger.info(
      `PresenceLayerBuilder: Finalized with ${this.features.length} presence features`,
    );

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
 * Builder for absence-only GeoJSON layer
 */
export class AbsenceLayerBuilder {
  private features: Feature<Geometry, WebGLFeatureProperties>[] = [];
  private processedCount = 0;

  /**
   * Add occurrence data if it's an absence
   * @param data - Occurrence data
   */
  add(data: OccurrenceData): void {
    const presenceStatus = getPresenceStatus(data.binary_presence);
    if (presenceStatus !== 'absence') {
      return; // Skip non-absence
    }

    this.features.push(createWebGLFeature(data));
    this.processedCount++;

    if (this.processedCount % 1000 === 0) {
      logger.debug(
        `AbsenceLayerBuilder: Processed ${this.processedCount} absence features`,
      );
    }
  }

  /**
   * Add multiple occurrence data items
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
   * Build and return the absence-only GeoJSON FeatureCollection
   * @returns GeoJSON FeatureCollection
   */
  build(): FeatureCollection<Geometry, WebGLFeatureProperties> {
    logger.info(
      `AbsenceLayerBuilder: Finalized with ${this.features.length} absence features`,
    );

    return {
      type: 'FeatureCollection',
      // @ts-expect-error add custom properties
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
 * Create stream processors for both presence and absence layers
 * @returns Object with presence and absence builders and processors
 */
export function createSplitLayerStreamProcessors() {
  const presenceBuilder = new PresenceLayerBuilder();
  const absenceBuilder = new AbsenceLayerBuilder();

  return {
    presenceBuilder,
    absenceBuilder,
    processBatch: (batch: OccurrenceData[], batchNumber: number) => {
      logger.debug(
        `Processing split layer batch ${batchNumber} with ${batch.length} items`,
      );
      presenceBuilder.addBatch(batch);
      absenceBuilder.addBatch(batch);
    },
    getPresenceResult: () => presenceBuilder.build(),
    getAbsenceResult: () => absenceBuilder.build(),
  };
}

/**
 * Split occurrence data into presence and absence arrays
 * @param data - Array of occurrence data
 * @returns Object with presence and absence arrays
 */
export function splitOccurrenceData(data: OccurrenceData[]): {
  presence: OccurrenceData[];
  absence: OccurrenceData[];
  unknown: OccurrenceData[];
} {
  const presence: OccurrenceData[] = [];
  const absence: OccurrenceData[] = [];
  const unknown: OccurrenceData[] = [];

  data.forEach((d) => {
    const status = getPresenceStatus(d.binary_presence);
    if (status === 'presence') {
      presence.push(d);
    } else if (status === 'absence') {
      absence.push(d);
    } else {
      unknown.push(d);
    }
  });

  logger.info(
    `Split ${data.length} occurrences: ${presence.length} presence, ${absence.length} absence, ${unknown.length} unknown`,
  );

  return { presence, absence, unknown };
}

/**
 * Create separate GeoJSON files for presence and absence
 * @param data - Array of occurrence data
 * @returns Object with presence and absence GeoJSON
 */
export function createSplitLayers(data: OccurrenceData[]): {
  presence: FeatureCollection<Geometry, WebGLFeatureProperties>;
  absence: FeatureCollection<Geometry, WebGLFeatureProperties>;
} {
  const { presence, absence } = splitOccurrenceData(data);

  const presenceBuilder = new PresenceLayerBuilder();
  presenceBuilder.addBatch(presence);

  const absenceBuilder = new AbsenceLayerBuilder();
  absenceBuilder.addBatch(absence);

  return {
    presence: presenceBuilder.build(),
    absence: absenceBuilder.build(),
  };
}
