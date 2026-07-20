/**
 * Atomic File Operations Module
 *
 * Provides atomic file replacement functionality for the job.
 * Files are first generated in a staging directory, then atomically
 * moved to the target directory to ensure data consistency.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { logger } from '@/utils/index.js';
import {
  markFileGenerated,
  markFileReplaced,
  markFileFailed,
  updatePhase,
  getFilesNeedingReplacement,
  isReplacementComplete,
  loadLedger,
} from './ledger.js';

/**
 * Options for atomic file replacement
 */
export interface AtomicReplaceOptions {
  /** Whether to create backup of existing files */
  createBackup?: boolean;
  /** Backup directory path */
  backupDirectory?: string;
  /** Whether to verify file checksums */
  verifyChecksums?: boolean;
  /** Whether to clean up staging files after replacement */
  cleanupStaging?: boolean;
}

const DEFAULT_OPTIONS: AtomicReplaceOptions = {
  createBackup: false,
  verifyChecksums: true,
  cleanupStaging: true,
};

/**
 * Calculate file checksum
 */
export async function calculateChecksum(
  filePath: string,
  algorithm: string = 'SHA256',
): Promise<string> {
  const hash = createHash(algorithm);
  const stream = await import('node:fs');

  return new Promise((resolve, reject) => {
    const readStream = stream.createReadStream(filePath);
    readStream.on('data', (data) => hash.update(data));
    readStream.on('end', () => resolve(hash.digest('hex')));
    readStream.on('error', (error) => reject(error));
  });
}

/**
 * Create backup of existing file
 */
async function createBackup(
  sourcePath: string,
  backupDir: string,
): Promise<string | null> {
  try {
    // Check if source file exists
    await fs.stat(sourcePath);
    const backupPath = path.join(
      backupDir,
      `backup_${path.basename(sourcePath)}_${Date.now()}`,
    );

    await fs.mkdir(backupDir, { recursive: true });
    await fs.copyFile(sourcePath, backupPath);

    logger.info(`Created backup of ${sourcePath} at ${backupPath}`);
    return backupPath;
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'ENOENT') {
      // Source file doesn't exist, no backup needed
      return null;
    }
    logger.error(`Failed to create backup for ${sourcePath}: ${error}`);
    throw error;
  }
}

/**
 * Atomically replace a single file
 * Uses rename operation which is atomic on POSIX systems
 */
async function atomicReplaceFile(
  stagingPath: string,
  targetPath: string,
  options: AtomicReplaceOptions,
): Promise<{
  success: boolean;
  checksum: string | undefined;
  error?: string;
  skipped: boolean;
}> {
  try {
    // Verify staging file exists
    const stats = await fs.stat(stagingPath);
    if (!stats.isFile()) {
      throw new Error(`Staging file is not a regular file: ${stagingPath}`);
    }

    // Calculate staging file checksum
    const stagingChecksum = await calculateChecksum(stagingPath);
    logger.debug(`Checksum for ${stagingPath}: ${stagingChecksum}`);

    // Check if target exists and has matching checksum (skip if so)
    try {
      const targetChecksum = await calculateChecksum(targetPath);

      if (targetChecksum === stagingChecksum) {
        logger.info(
          `Skipping ${targetPath} - checksum matches (already current)`,
        );
        return { success: true, checksum: stagingChecksum, skipped: true };
      }
    } catch (error: unknown) {
      if ((error as { code?: string }).code !== 'ENOENT') {
        throw error;
      }
      // Target doesn't exist, proceed with replacement
    }

    // Create backup if requested
    if (options.createBackup && options.backupDirectory) {
      await createBackup(targetPath, options.backupDirectory);
    }

    // Atomic replacement using rename
    // First, ensure parent directory exists
    const targetDir = path.dirname(targetPath);
    await fs.mkdir(targetDir, { recursive: true });

    // Remove existing file if it exists (rename will fail if target exists)
    try {
      await fs.unlink(targetPath);
      logger.debug(`Removed existing file: ${targetPath}`);
    } catch (error: unknown) {
      if ((error as { code?: string }).code !== 'ENOENT') {
        throw error;
      }
    }

    // Atomic rename operation
    await fs.rename(stagingPath, targetPath);
    logger.info(`Atomically replaced ${targetPath}`);

    return { success: true, checksum: stagingChecksum, skipped: false };
  } catch (error) {
    logger.error(`Failed to atomically replace ${targetPath}: ${error}`);
    return {
      success: false,
      checksum: undefined,
      error: error instanceof Error ? error.message : String(error),
      skipped: false,
    };
  }
}

/**
 * Atomically replace all files from staging to target directory
 * This is the main atomic operation that ensures all files are updated together
 */
export async function atomicReplaceAll(
  stagingDirectory: string,
  targetDirectory: string,
  filenames: string[],
  options: AtomicReplaceOptions = {},
): Promise<{
  success: boolean;
  replacedFiles: string[];
  skippedFiles: string[];
  failedFiles: string[];
  errors: Record<string, string>;
}> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  // Get backup directory
  const backupDir =
    options.backupDirectory ||
    path.join(stagingDirectory, '.backups', Date.now().toString());

  const result = {
    success: false,
    replacedFiles: [] as string[],
    skippedFiles: [] as string[],
    failedFiles: [] as string[],
    errors: {} as Record<string, string>,
  };

  try {
    // Update phase
    await updatePhase(stagingDirectory, 'replacement_in_progress');

    // Ensure backup directory exists if needed
    if (mergedOptions.createBackup) {
      await fs.mkdir(backupDir, { recursive: true });
    }

    // Process each file
    for (const filename of filenames) {
      const stagingPath = path.join(stagingDirectory, filename);
      const targetPath = path.join(targetDirectory, filename);

      const replaceResult = await atomicReplaceFile(stagingPath, targetPath, {
        ...mergedOptions,
        backupDirectory: backupDir,
      });

      if (replaceResult.success) {
        if (replaceResult.skipped) {
          result.skippedFiles.push(filename);
          // Mark as replaced in ledger (it's already current in target)
          await markFileReplaced(stagingDirectory, filename);

          // Clean up staging file if requested (even though it was skipped)
          if (mergedOptions.cleanupStaging) {
            try {
              await fs.unlink(stagingPath);
              logger.debug(`Cleaned up staging file (skipped): ${stagingPath}`);
            } catch (error) {
              logger.warn(
                `Failed to clean up staging file ${stagingPath}: ${error}`,
              );
            }
          }
        } else {
          result.replacedFiles.push(filename);

          // Update ledger
          await markFileReplaced(stagingDirectory, filename);

          // Clean up staging file if requested
          if (mergedOptions.cleanupStaging) {
            try {
              await fs.unlink(stagingPath);
              logger.debug(`Cleaned up staging file: ${stagingPath}`);
            } catch (error) {
              logger.warn(
                `Failed to clean up staging file ${stagingPath}: ${error}`,
              );
            }
          }
        }
      } else {
        result.failedFiles.push(filename);
        result.errors[filename] = replaceResult.error || 'Unknown error';

        // Mark as failed in ledger
        await markFileFailed(
          stagingDirectory,
          filename,
          replaceResult.error || 'Unknown error',
        );
      }
    }

    // Check if all files were processed successfully
    const allProcessed = result.failedFiles.length === 0;
    const replacementComplete = await isReplacementComplete(stagingDirectory);

    if (allProcessed && replacementComplete) {
      await updatePhase(stagingDirectory, 'completed');
      result.success = true;
      logger.info('All files atomically replaced successfully');
    } else {
      await updatePhase(
        stagingDirectory,
        'failed',
        'Some files failed to replace',
      );
      result.success = false;
      logger.error('Atomic replacement failed for some files');
    }

    return result;
  } catch (error) {
    logger.error(`Critical error during atomic replacement: ${error}`);
    await updatePhase(
      stagingDirectory,
      'failed',
      error instanceof Error ? error.message : String(error),
    );
    result.success = false;
    throw error;
  }
}

/**
 * Replace files atomically with ledger tracking
 * This function uses the ledger to track progress and supports resumption
 */
export async function atomicReplaceWithLedger(
  stagingDirectory: string,
  targetDirectory: string,
  filenames: string[],
  options: AtomicReplaceOptions = {},
): Promise<{
  success: boolean;
  replacedFiles: string[];
  skippedFiles: string[];
  failedFiles: string[];
  errors: Record<string, string>;
  resumed: boolean;
}> {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const result = {
    success: false,
    replacedFiles: [] as string[],
    skippedFiles: [] as string[],
    failedFiles: [] as string[],
    errors: {} as Record<string, string>,
    resumed: false,
  };

  try {
    // Load existing ledger to check for resumption
    const ledger = await loadLedger(stagingDirectory);

    // If ledger exists and we have files needing replacement, resume
    if (ledger && ledger.phase === 'generation_complete') {
      // Get files that still need replacement
      const filesToReplace = await getFilesNeedingReplacement(stagingDirectory);

      if (filesToReplace.length > 0) {
        result.resumed = true;
        logger.info('Resuming atomic replacement from previous run');

        const replaceResult = await atomicReplaceAll(
          stagingDirectory,
          targetDirectory,
          filesToReplace,
          mergedOptions,
        );

        result.replacedFiles = replaceResult.replacedFiles;
        result.skippedFiles = replaceResult.skippedFiles;
        result.failedFiles = replaceResult.failedFiles;
        result.errors = replaceResult.errors;
        result.success = replaceResult.success;

        return result;
      }
    }

    // Full replacement if not resuming
    const replaceResult = await atomicReplaceAll(
      stagingDirectory,
      targetDirectory,
      filenames,
      mergedOptions,
    );

    result.replacedFiles = replaceResult.replacedFiles;
    result.skippedFiles = replaceResult.skippedFiles;
    result.failedFiles = replaceResult.failedFiles;
    result.errors = replaceResult.errors;
    result.success = replaceResult.success;

    return result;
  } catch (error) {
    logger.error(`Error in atomicReplaceWithLedger: ${error}`);
    result.success = false;
    throw error;
  }
}

/**
 * Write file to staging directory with ledger tracking
 */
export async function writeToStagingWithLedger(
  stagingDirectory: string,
  filename: string,
  content: string | Buffer | object,
  checksum?: string,
): Promise<{
  success: boolean;
  filePath: string;
  size: number;
  checksum?: string;
  error?: string;
}> {
  try {
    const filePath = path.join(stagingDirectory, filename);

    // Ensure staging directory exists
    await fs.mkdir(stagingDirectory, { recursive: true });

    // Convert object to JSON string if needed, but not for Buffer
    let finalContent: string | Buffer;
    if (Buffer.isBuffer(content)) {
      finalContent = content;
    } else if (typeof content === 'object' && content !== null) {
      finalContent = JSON.stringify(content, null, 2);
    } else {
      finalContent = content;
    }

    // Write file
    await fs.writeFile(filePath, finalContent);

    // Get file stats
    const stats = await fs.stat(filePath);
    const size = stats.size;

    // Calculate checksum if not provided
    if (!checksum) {
      checksum = await calculateChecksum(filePath);
    }

    // Update ledger
    await markFileGenerated(stagingDirectory, filename, size, checksum);

    logger.info(
      `Wrote file to staging: ${filePath} (${size} bytes, checksum: ${checksum?.substring(0, 8)}...)`,
    );

    return { success: true, filePath, size, checksum };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      `Failed to write file to staging: ${filename}: ${errorMessage}`,
    );

    // Mark as failed in ledger (if ledger exists)
    try {
      await markFileFailed(stagingDirectory, filename, errorMessage);
    } catch (ledgerError) {
      // Ledger doesn't exist or can't be updated - that's okay, we already have the error
      logger.debug(`Could not mark file as failed in ledger: ${ledgerError}`);
    }

    return {
      success: false,
      filePath: path.join(stagingDirectory, filename),
      size: 0,
      error: errorMessage,
    };
  }
}

export default {
  atomicReplaceAll,
  atomicReplaceWithLedger,
  writeToStagingWithLedger,
  calculateChecksum,
};
