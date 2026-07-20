/**
 * Occurrence data builder for collecting transformed OccurrenceData objects
 *
 * Simple class that appends OccurrenceData to an array for output as JSON
 */

import type { OccurrenceData } from '@/types/index.js';
import { logger } from '@/utils/index.js';

/**
 * Class for building an array of OccurrenceData objects
 * Used for generating the occurrence data JSON file (as served via GraphQL)
 */
export class OccurrenceBuilder {
  private occurrences: OccurrenceData[] = [];
  private processedCount = 0;

  /**
   * Add a single OccurrenceData object
   * @param data - Transformed occurrence data
   */
  add(data: OccurrenceData): void {
    this.occurrences.push(data);
    this.processedCount++;

    if (this.processedCount % 1000 === 0) {
      logger.debug(
        `OccurrenceBuilder: Processed ${this.processedCount} occurrences`,
      );
    }
  }

  /**
   * Add multiple OccurrenceData objects
   * @param data - Array of occurrence data
   */
  addBatch(data: OccurrenceData[]): void {
    data.forEach((d) => this.add(d));
  }

  /**
   * Get the current count of occurrences
   */
  get count(): number {
    return this.occurrences.length;
  }

  /**
   * Build and return the final array of OccurrenceData
   * @returns Array of OccurrenceData objects
   */
  build(): OccurrenceData[] {
    logger.info(
      `OccurrenceBuilder: Finalized with ${this.occurrences.length} occurrences`,
    );
    return this.occurrences;
  }

  /**
   * Reset the builder for reuse
   */
  reset(): void {
    this.occurrences = [];
    this.processedCount = 0;
  }
}

/**
 * Create a stream processor that builds occurrence data array incrementally
 * @returns Object with builder, processBatch, and getResult methods
 */
export function createOccurrenceStreamProcessor() {
  const builder = new OccurrenceBuilder();

  return {
    builder,
    processBatch: (batch: OccurrenceData[], batchNumber: number) => {
      logger.debug(
        `Processing occurrence batch ${batchNumber} with ${batch.length} items`,
      );
      builder.addBatch(batch);
    },
    getResult: () => builder.build(),
  };
}
