import Cursor from 'pg-cursor';
import type { Geometry } from 'geojson';
import type { OccurrenceData } from '@/types/index.js';
import {
  createCursor,
  fetchAllFromCursor,
  processCursorBatches,
} from './cursor.js';
import { GET_OCCURRENCE_DATA } from './queries.js';
import { logger, evaluateBooleanOrUndefined } from '@/utils/index.js';

/**
 * Interface for raw database row with verbose column names
 */
interface OccurrenceRow {
  occurrence_id: string;
  recorded_species_species: string | null;
  occurrence_binary_presence: string | null;
  occurrence_abundance_data: string | null;
  occurrence_bio_data: string | null;
  occurrence_insecticide_resistance_data: string | null;
  occurrence_season_given: string | null;
  occurrence_season_calc: string | null;
  occurrence_year_start: number | null;
  occurrence_larval_data: string | null;
  occurrence_adult_data: string | null;
  site_country: string | null;
  site_location_geojson: string | null;
  sample_control: string | null;
}

/**
 * Transforms a raw database row into OccurrenceData      ? !!row.occurrence_larval_data
 * @param row - Raw database row
 * @returns Transformed OccurrenceData
 */
function transformRow(row: OccurrenceRow): OccurrenceData {
  logger.debug(`Transforming row with id: ${row.occurrence_id}`);

  // Handle location - parse GeoJSON string from ST_AsGeoJSON
  let location: Geometry;
  if (row.site_location_geojson) {
    try {
      const geoJsonObj = JSON.parse(row.site_location_geojson) as {
        type: string;
        coordinates: number[];
      };
      location = {
        type: geoJsonObj.type as 'Point',
        coordinates: geoJsonObj.coordinates,
      };
      logger.debug(`  Parsed PostGIS location: ${JSON.stringify(location)}`);
    } catch (err) {
      logger.error(
        `  Failed to parse location for occurrence ${row.occurrence_id}: %O`,
        err,
      );
      location = { type: 'Point', coordinates: [0, 0] };
    }
  } else {
    logger.warn(
      `  No location data for occurrence ${row.occurrence_id}, using empty Point`,
    );
    location = { type: 'Point', coordinates: [0, 0] };
  }

  return {
    id: row.occurrence_id,
    species: row.recorded_species_species ?? undefined,
    binary_presence: row.occurrence_binary_presence ?? undefined,
    location,
    country: row.site_country ?? '',
    year_start: row.occurrence_year_start ?? undefined,
    // Boolean fields using evaluateBooleanOrUndefined
    has_adult: evaluateBooleanOrUndefined(row.occurrence_adult_data),
    has_larval: evaluateBooleanOrUndefined(row.occurrence_larval_data),
    // Use season_calc first, then season_given, then empty string
    season_val: row.occurrence_season_calc || row.occurrence_season_given || '',
    insecticide: row.occurrence_insecticide_resistance_data ?? undefined,
    abundance_data: row.occurrence_abundance_data ?? undefined,
    bio_data: row.occurrence_bio_data ?? undefined,
    // Boolean evaluations of string fields
    is_presence: evaluateBooleanOrUndefined(row.occurrence_binary_presence),
    has_abundance: evaluateBooleanOrUndefined(row.occurrence_abundance_data),
    has_bionomics: evaluateBooleanOrUndefined(row.occurrence_bio_data),
    // Epoch timestamp for filtering - matches UI logic: localToUTC(new Date(year, 0)).getTime()
    // Defaults to 0 if year_start is not available
    year_start_epoch: row.occurrence_year_start
      ? new Date(row.occurrence_year_start, 0).getTime() -
        new Date(row.occurrence_year_start, 0).getTimezoneOffset() * 60000
      : 0,
  };
}

/**
 * Fetches all occurrence data from the database using pg-cursor
 * @param batchSize - Number of rows to fetch per batch (default: 1000)
 * @returns Promise resolving to array of OccurrenceData
 */
export async function fetchOccurrenceData(
  batchSize: number = 1000,
): Promise<OccurrenceData[]> {
  logger.info('Starting to fetch occurrence data from database');

  try {
    // Create cursor for the query
    const cursor: Cursor = await createCursor(GET_OCCURRENCE_DATA);

    // Fetch all rows with transformation
    const results = await fetchAllFromCursor<OccurrenceData>(
      cursor,
      batchSize,
      transformRow,
    );

    logger.info(`Successfully fetched ${results.length} occurrence records`);
    return results;
  } catch (err) {
    logger.error('Failed to fetch occurrence data: %O', err);
    throw err;
  }
}

/**
 * Fetches occurrence data in batches and processes each batch
 * Useful for memory-efficient processing of large datasets
 * @param batchSize - Number of rows to fetch per batch
 * @param processFn - Function to process each batch of OccurrenceData
 * @returns Promise that resolves when all data is processed
 */
export async function streamOccurrenceData(
  batchSize: number = 1000,
  processFn: (
    batch: OccurrenceData[],
    batchNumber: number,
  ) => Promise<void> | void,
): Promise<void> {
  logger.info('Starting to stream occurrence data from database');

  try {
    const cursor: Cursor = await createCursor(GET_OCCURRENCE_DATA);

    await processCursorBatches(
      cursor,
      batchSize,
      async (batch: OccurrenceRow[], batchNumber: number) => {
        const transformedBatch = batch.map(transformRow);
        await processFn(transformedBatch, batchNumber);
      },
    );

    logger.info('Finished streaming occurrence data');
  } catch (err) {
    logger.error('Failed to stream occurrence data: %O', err);
    throw err;
  }
}
