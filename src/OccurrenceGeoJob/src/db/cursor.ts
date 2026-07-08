import type { PoolClient } from 'pg';
import Cursor from 'pg-cursor';
import { logger, pool } from '@/utils/index.js';

/**
 * Creates and returns a cursor for the given query
 * @param query - The SQL query string
 * @param params - Query parameters (optional)
 * @returns Promise resolving to a Cursor instance
 */
export async function createCursor(
  query: string,
  params: any[] = [],
): Promise<Cursor> {
  logger.debug(`Creating cursor for query: ${query.substring(0, 100)}...`);

  const client: PoolClient = await pool.connect();

  try {
    const cursor = client.query(new Cursor(query, params));
    logger.debug('Cursor created successfully');

    // Attach cleanup handler
    cursor.on('end', () => {
      logger.debug('Cursor ended, releasing client');
      client.release();
    });

    cursor.on('error', (err: Error) => {
      logger.error('Cursor error: %O', err);
      client.release();
    });

    return cursor;
  } catch (err) {
    logger.error('Failed to create cursor: %O', err);
    client.release();
    throw err;
  }
}

/**
 * Fetches all rows from a cursor in batches
 * @param cursor - The Cursor instance
 * @param batchSize - Number of rows to fetch per batch (default: 1000)
 * @param transformFn - Optional function to transform each row
 * @returns Promise resolving to array of transformed rows
 */
export async function fetchAllFromCursor<T>(
  cursor: Cursor,
  batchSize: number = 1000,
  transformFn?: (row: any) => T,
): Promise<T[]> {
  const results: T[] = [];
  let batchNumber = 0;

  logger.debug(`Starting to fetch rows in batches of ${batchSize}`);

  while (true) {
    batchNumber++;
    const batch = await cursor.read(batchSize);

    if (batch.length === 0) {
      logger.debug(
        `Fetch complete. Total batches: ${batchNumber}, total rows: ${results.length}`,
      );
      break;
    }

    logger.debug(`Fetched batch ${batchNumber} with ${batch.length} rows`);

    // Transform and add to results
    const transformedBatch = transformFn ? batch.map(transformFn) : batch;

    results.push(...transformedBatch);
  }

  return results;
}

/**
 * Fetches rows from a cursor and processes them with a callback
 * Useful for streaming processing without loading all into memory
 * @param cursor - The Cursor instance
 * @param batchSize - Number of rows to fetch per batch
 * @param processFn - Function to process each batch
 * @returns Promise that resolves when all rows are processed
 */
export async function processCursorBatches<T>(
  cursor: Cursor,
  batchSize: number = 1000,
  processFn: (batch: T[], batchNumber: number) => Promise<void> | void,
): Promise<void> {
  let batchNumber = 0;
  let totalProcessed = 0;

  logger.debug(`Starting to process rows in batches of ${batchSize}`);

  while (true) {
    batchNumber++;
    const batch = await cursor.read(batchSize);

    if (batch.length === 0) {
      logger.debug(
        `Processing complete. Total batches: ${batchNumber}, total rows: ${totalProcessed}`,
      );
      break;
    }

    logger.debug(`Processing batch ${batchNumber} with ${batch.length} rows`);

    await processFn(batch, batchNumber);
    totalProcessed += batch.length;
  }
}
