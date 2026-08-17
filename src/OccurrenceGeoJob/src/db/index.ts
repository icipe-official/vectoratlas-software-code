/**
 * Database access module for OccurrenceGeoJob
 *
 * This module provides utilities for fetching occurrence data from PostgreSQL
 * using pg-cursor for efficient streaming of large result sets.
 *
 * @module db
 */

export {
  createCursor,
  fetchAllFromCursor,
  processCursorBatches,
} from './cursor.js';
export { GET_OCCURRENCE_DATA } from './queries.js';
export {
  fetchOccurrenceData,
  streamOccurrenceData,
} from './occurrenceFetcher.js';
