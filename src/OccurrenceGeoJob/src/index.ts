#!/usr/bin/env node

/**
 * OccurrenceGeoJob - Main Entry Point
 *
 * Pre-processes occurrence data from PostgreSQL into:
 * - Raw occurrence data JSON (as served via GraphQL)
 * - Combined WebGL-ready GeoJSON
 * - Presence-only GeoJSON layer
 * - Absence-only GeoJSON layer
 *
 * Now supports atomic file generation with:
 * - Staging directory for new files
 * - Target directory for existing files
 * - JSON configuration file for file paths
 * - Ledger tracking for resumption support
 *
 * Usage:
 *   npm run dev
 *
 * Environment variables:
 *   PGPORT, PGUSER, PGPASSWORD, PDATABASE, PGHOST - PostgreSQL connection
 *   TARGET_DIRECTORY - Original directory containing existing files
 *   STAGING_DIRECTORY - Temporary directory for new files
 *   FILE_PATHS_CONFIG - Path to JSON file containing file path configurations
 *   BATCH_SIZE - Number of records per batch (default: 1000)
 *   CREATE_BACKUP - Whether to create backups of existing files (default: false)
 */

import { logger } from './utils/index.js';
import { streamOccurrenceData } from './db/index.js';
import {
  setupCoordinates,
  createOccurrenceStreamProcessor,
  createGeoJSONStreamProcessor,
  createSplitLayerStreamProcessors,
} from './preprocess/index.js';
import { compressFileToFormats, DEFAULT_FORMATS } from './compress/index.js';
import {
  getFilePathsConfig,
  getAbsoluteFilePaths,
  ensureDirectoriesExist,
  initializeLedger,
  updatePhase,
  atomicReplaceWithLedger,
  writeToStagingWithLedger,
  loadLedger,
} from './config/index.js';

/**
 * Main processing function
 */
async function main() {
  logger.info('Starting OccurrenceGeoJob...');

  // Initialize coordinate projections
  setupCoordinates();
  logger.info('Coordinate projections initialized');

  try {
    // Get file paths configuration
    const config = await getFilePathsConfig();
    const { target } = getAbsoluteFilePaths(config);
    const filenames = Object.values(config.files);

    logger.info(`Configuration loaded:`);
    logger.info(`  - Target directory: ${config.targetDirectory}`);
    logger.info(`  - Staging directory: ${config.stagingDirectory}`);

    // Ensure directories exist
    await ensureDirectoriesExist(config);

    // Check for existing ledger (resumption)
    const existingLedger = await loadLedger(config.stagingDirectory);

    if (existingLedger) {
      logger.info(
        `Found existing ledger. Current phase: ${existingLedger.phase}`,
      );

      // Check if we can resume generation
      if (
        existingLedger.phase === 'generation_in_progress' ||
        existingLedger.phase === 'generation_complete'
      ) {
        logger.info('Resuming from previous run...');
      }
    }

    // Initialize ledger if it doesn't exist
    if (!existingLedger) {
      await initializeLedger(config.stagingDirectory, filenames);
    }

    await updatePhase(config.stagingDirectory, 'generation_in_progress');

    // Create stream processors
    const occProcessor = createOccurrenceStreamProcessor();
    const geoJsonProcessor = createGeoJSONStreamProcessor();
    const splitProcessor = createSplitLayerStreamProcessors();

    // Stream data from database in batches
    const batchSize = parseInt(process.env.BATCH_SIZE || '1000', 10);
    logger.info(
      `Streaming occurrence data from database in batches of ${batchSize}...`,
    );

    await streamOccurrenceData(batchSize, (batch, batchNumber) => {
      // Process each batch
      occProcessor.processBatch(batch, batchNumber);
      geoJsonProcessor.processBatch(batch, batchNumber);
      splitProcessor.processBatch(batch, batchNumber);
    });

    // Get results
    const occurrenceData = occProcessor.getResult();
    const geoJson = geoJsonProcessor.getResult();
    const presenceGeoJson = splitProcessor.getPresenceResult();
    const absenceGeoJson = splitProcessor.getAbsenceResult();

    logger.info(`Data processing complete:`);
    logger.info(`  - Total occurrences: ${occurrenceData.length}`);
    logger.info(`  - Total GeoJSON features: ${geoJson.features.length}`);
    logger.info(`  - Presence features: ${presenceGeoJson.features.length}`);
    logger.info(`  - Absence features: ${absenceGeoJson.features.length}`);

    // Write output files to staging directory with ledger tracking
    logger.info('Writing files to staging directory...');
    await writeOutputFilesToStaging(config, {
      occurrenceData,
      geoJson,
      presenceGeoJson,
      absenceGeoJson,
    });

    // Update ledger phase
    await updatePhase(config.stagingDirectory, 'generation_complete');

    // Perform atomic replacement
    logger.info('Performing atomic file replacement...');
    const createBackup =
      process.env.CREATE_BACKUP?.toLowerCase() === 'true' || false;

    const replaceResult = await atomicReplaceWithLedger(
      config.stagingDirectory,
      config.targetDirectory,
      filenames,
      { createBackup },
    );

    if (replaceResult.success) {
      logger.info('Atomic replacement completed successfully!');
      if (replaceResult.resumed) {
        logger.info('Job resumed and completed successfully');
      }
    } else {
      logger.error('Atomic replacement completed with errors:');
      logger.error(`  - Failed files: ${replaceResult.failedFiles.join(', ')}`);
      for (const [filename, error] of Object.entries(replaceResult.errors)) {
        logger.error(`  - ${filename}: ${error}`);
      }
      process.exit(1);
    }

    // Compress the GeoJSON files in target directory
    // Use overwrite: true to ensure compressed files are replaced when source changes
    logger.info('Compressing GeoJSON files...');
    await compressGeoJSONFiles(target, true);

    logger.info('OccurrenceGeoJob completed successfully!');
    process.exit(0);
  } catch (err) {
    logger.error('OccurrenceGeoJob failed: %O', err);
    process.exit(1);
  }
}

/**
 * Write all output files to staging directory with ledger tracking
 */
async function writeOutputFilesToStaging(
  config: any,
  {
    occurrenceData,
    geoJson,
    presenceGeoJson,
    absenceGeoJson,
  }: {
    occurrenceData: any[];
    geoJson: any;
    presenceGeoJson: any;
    absenceGeoJson: any;
  },
): Promise<void> {
  // Write files with ledger tracking
  const writeTasks = [
    writeToStagingWithLedger(
      config.stagingDirectory,
      config.files.dataJson,
      occurrenceData,
    ).then((result) => {
      if (result.success) {
        logger.info(
          `Wrote occurrence data to staging: ${result.filePath} (${occurrenceData.length} records, ${result.size} bytes)`,
        );
      } else {
        logger.error(
          `Failed to write occurrence data to staging: ${result.error}`,
        );
        throw new Error(result.error);
      }
    }),

    writeToStagingWithLedger(
      config.stagingDirectory,
      config.files.dataGeojson,
      geoJson,
    ).then((result) => {
      if (result.success) {
        logger.info(
          `Wrote combined GeoJSON to staging: ${result.filePath} (${geoJson.features.length} features, ${result.size} bytes)`,
        );
      } else {
        logger.error(
          `Failed to write combined GeoJSON to staging: ${result.error}`,
        );
        throw new Error(result.error);
      }
    }),

    writeToStagingWithLedger(
      config.stagingDirectory,
      config.files.presenceGeojson,
      presenceGeoJson,
    ).then((result) => {
      if (result.success) {
        logger.info(
          `Wrote presence GeoJSON to staging: ${result.filePath} (${presenceGeoJson.features.length} features, ${result.size} bytes)`,
        );
      } else {
        logger.error(
          `Failed to write presence GeoJSON to staging: ${result.error}`,
        );
        throw new Error(result.error);
      }
    }),

    writeToStagingWithLedger(
      config.stagingDirectory,
      config.files.absenceGeojson,
      absenceGeoJson,
    ).then((result) => {
      if (result.success) {
        logger.info(
          `Wrote absence GeoJSON to staging: ${result.filePath} (${absenceGeoJson.features.length} features, ${result.size} bytes)`,
        );
      } else {
        logger.error(
          `Failed to write absence GeoJSON to staging: ${result.error}`,
        );
        throw new Error(result.error);
      }
    }),
  ];

  await Promise.all(writeTasks);
}

/**
 * Compress the GeoJSON files that were written to target directory
 */
async function compressGeoJSONFiles(
  targetPaths: {
    dataJson: string;
    dataGeojson: string;
    presenceGeojson: string;
    absenceGeojson: string;
  },
  overwrite: boolean = false,
): Promise<void> {
  const compressTasks = [
    compressFileToFormats(targetPaths.dataGeojson, DEFAULT_FORMATS, {
      overwrite,
    }),
    compressFileToFormats(targetPaths.presenceGeojson, DEFAULT_FORMATS, {
      overwrite,
    }),
    compressFileToFormats(targetPaths.absenceGeojson, DEFAULT_FORMATS, {
      overwrite,
    }),
    compressFileToFormats(targetPaths.dataJson, DEFAULT_FORMATS, { overwrite }),
  ];

  await Promise.all(compressTasks);
}

// Run main
main().catch((err) => {
  logger.error('Unhandled error in main: %O', err);
  process.exit(1);
});
