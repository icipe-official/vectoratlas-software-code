import { readFileSync } from 'fs';
import path from 'path';
import { logger } from '@/utils/index.js';

// SQL files are in the sql/ directory relative to project root
const QUERIES_DIR = path.join(process.env.SQL_QUERIES_FOLDER || 'sql');

/**
 * Loads SQL query from file
 * @param filename - SQL file name (without extension)
 * @returns Query string
 */
function loadSqlQuery(filename: string): string {
  const filepath = path.join(QUERIES_DIR, `${filename}.sql`);
  logger.debug(`Loading SQL query from: ${filepath}`);

  try {
    const query = readFileSync(filepath, 'utf8');
    logger.debug(`SQL query loaded successfully (${query.length} characters)`);
    return query;
  } catch (err) {
    logger.error(`Failed to load SQL query from ${filepath}: %O`, err);
    throw err;
  }
}

// Export queries
export const GET_OCCURRENCE_DATA = loadSqlQuery('occurrence_data');
