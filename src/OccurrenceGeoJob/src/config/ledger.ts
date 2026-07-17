/**
 * Ledger/Status Tracking Module
 *
 * Tracks the state of file generation and replacement operations
 * to support atomic operations and resumption of interrupted jobs.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '@/utils/index.js';

/**
 * Status types for file generation
 */
export type FileStatus = 'pending' | 'generated' | 'replaced' | 'failed';

export type GenerationPhase =
  | 'not_started'
  | 'generation_in_progress'
  | 'generation_complete'
  | 'replacement_in_progress'
  | 'completed'
  | 'failed';

/**
 * Interface for tracking individual file status
 */
export interface FileState {
  filename: string;
  status: FileStatus;
  generatedAt?: string;
  replacedAt?: string;
  errorMessage: string | undefined;
  size: number;
  checksum: string | undefined;
}

/**
 * Interface for the overall ledger state
 */
export interface LedgerState {
  version: string;
  startedAt: string;
  completedAt?: string;
  phase: GenerationPhase;
  totalFiles: number;
  files: Record<string, FileState>;
  errorMessage?: string;
  retryCount: number;
}

/**
 * Default ledger state
 */
const DEFAULT_LEDGER: Omit<LedgerState, 'startedAt'> = {
  version: '1.0.0',
  phase: 'not_started',
  totalFiles: 0,
  files: {},
  retryCount: 0,
};

/**
 * Path to the ledger file
 */
function getLedgerPath(stagingDirectory: string): string {
  return path.join(stagingDirectory, '.generation_ledger.json');
}

/**
 * Initialize a new ledger
 */
export async function initializeLedger(
  stagingDirectory: string,
  filenames: string[],
): Promise<LedgerState> {
  const ledgerPath = getLedgerPath(stagingDirectory);

  // Ensure staging directory exists
  await fs.mkdir(stagingDirectory, { recursive: true });

  const now = new Date().toISOString();
  const ledger: LedgerState = {
    ...DEFAULT_LEDGER,
    startedAt: now,
    totalFiles: filenames.length,
    files: {},
  };

  // Initialize file states
  for (const filename of filenames) {
    ledger.files[filename] = {
      filename,
      status: 'pending',
      size: 0,
      errorMessage: undefined,
      checksum: undefined,
    };
  }

  await saveLedger(ledgerPath, ledger);
  logger.info(
    `Initialized ledger with ${filenames.length} files: ${ledgerPath}`,
  );

  return ledger;
}

/**
 * Load existing ledger from file
 */
export async function loadLedger(
  stagingDirectory: string,
): Promise<LedgerState | null> {
  const ledgerPath = getLedgerPath(stagingDirectory);

  try {
    const content = await fs.readFile(ledgerPath, 'utf-8');
    const ledger = JSON.parse(content) as LedgerState;

    logger.info(`Loaded ledger from ${ledgerPath}. Phase: ${ledger.phase}`);
    return ledger;
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'ENOENT') {
      logger.info(`No existing ledger found at ${ledgerPath}`);
      return null;
    }
    logger.error(`Failed to load ledger from ${ledgerPath}: ${error}`);
    throw error;
  }
}

/**
 * Save ledger to file atomically
 * Uses temp file + rename pattern to ensure atomic writes
 */
async function saveLedger(
  ledgerPath: string,
  ledger: LedgerState,
): Promise<void> {
  try {
    const content = JSON.stringify(ledger, null, 2);
    
    // Create temp file path
    const tempPath = `${ledgerPath}.tmp`;
    
    // Write to temp file first
    await fs.writeFile(tempPath, content);
    
    // Atomically rename temp file to target
    // On POSIX systems, rename is atomic
    await fs.rename(tempPath, ledgerPath);
    
    logger.debug(`Saved ledger to ${ledgerPath}`);
  } catch (error) {
    logger.error(`Failed to save ledger to ${ledgerPath}: ${error}`);
    // Try to clean up temp file if it exists
    try {
      const tempPath = `${ledgerPath}.tmp`;
      await fs.unlink(tempPath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

/**
 * Update file status in ledger
 */
export async function updateFileStatus(
  stagingDirectory: string,
  filename: string,
  updates: Partial<FileState>,
): Promise<LedgerState> {
  const ledger = await loadLedger(stagingDirectory);
  if (!ledger) {
    throw new Error('Ledger not found');
  }

  if (!ledger.files[filename]) {
    throw new Error(`File ${filename} not found in ledger`);
  }

  ledger.files[filename] = {
    ...ledger.files[filename],
    ...updates,
  };

  await saveLedger(getLedgerPath(stagingDirectory), ledger);
  return ledger;
}

/**
 * Update the overall phase
 */
export async function updatePhase(
  stagingDirectory: string,
  phase: GenerationPhase,
  errorMessage?: string,
): Promise<LedgerState> {
  const ledger = await loadLedger(stagingDirectory);
  if (!ledger) {
    throw new Error('Ledger not found');
  }

  ledger.phase = phase;
  if (errorMessage) {
    ledger.errorMessage = errorMessage;
  }

  if (phase === 'completed') {
    ledger.completedAt = new Date().toISOString();
  }

  await saveLedger(getLedgerPath(stagingDirectory), ledger);
  logger.info(`Updated ledger phase to ${phase}`);

  return ledger;
}

/**
 * Mark file as generated
 */
export async function markFileGenerated(
  stagingDirectory: string,
  filename: string,
  size: number,
  checksum: string | undefined = undefined,
): Promise<LedgerState> {
  const now = new Date().toISOString();

  return updateFileStatus(stagingDirectory, filename, {
    status: 'generated',
    generatedAt: now,
    size,
    checksum,
  });
}

/**
 * Mark file as replaced
 */
export async function markFileReplaced(
  stagingDirectory: string,
  filename: string,
): Promise<LedgerState> {
  const now = new Date().toISOString();

  return updateFileStatus(stagingDirectory, filename, {
    status: 'replaced',
    replacedAt: now,
    errorMessage: undefined,
  });
}

/**
 * Mark file as failed
 */
export async function markFileFailed(
  stagingDirectory: string,
  filename: string,
  errorMessage: string,
): Promise<LedgerState> {
  return updateFileStatus(stagingDirectory, filename, {
    status: 'failed',
    errorMessage,
  });
}

/**
 * Get files that need generation (pending or failed)
 */
export async function getFilesNeedingGeneration(
  stagingDirectory: string,
): Promise<string[]> {
  const ledger = await loadLedger(stagingDirectory);
  if (!ledger) {
    return [];
  }

  return Object.entries(ledger.files)
    .filter(
      ([_, state]) => state.status === 'pending' || state.status === 'failed',
    )
    .map(([filename]) => filename);
}

/**
 * Get files that need replacement (generated but not replaced)
 */
export async function getFilesNeedingReplacement(
  stagingDirectory: string,
): Promise<string[]> {
  const ledger = await loadLedger(stagingDirectory);
  if (!ledger) {
    return [];
  }

  return Object.entries(ledger.files)
    .filter(([_, state]) => state.status === 'generated' && !state.replacedAt)
    .map(([filename]) => filename);
}

/**
 * Check if generation phase is complete
 */
export async function isGenerationComplete(
  stagingDirectory: string,
): Promise<boolean> {
  const ledger = await loadLedger(stagingDirectory);
  if (!ledger) {
    return false;
  }

  const allFiles = Object.values(ledger.files);
  const completedFiles = allFiles.filter(
    (state) => state.status === 'generated' || state.status === 'replaced',
  );

  return completedFiles.length === allFiles.length;
}

/**
 * Check if all files have been replaced
 */
export async function isReplacementComplete(
  stagingDirectory: string,
): Promise<boolean> {
  const ledger = await loadLedger(stagingDirectory);
  if (!ledger) {
    return false;
  }

  const allFiles = Object.values(ledger.files);
  const replacedFiles = allFiles.filter((state) => state.status === 'replaced');

  return replacedFiles.length === allFiles.length;
}

/**
 * Increment retry count
 */
export async function incrementRetryCount(
  stagingDirectory: string,
): Promise<LedgerState> {
  const ledger = await loadLedger(stagingDirectory);
  if (!ledger) {
    throw new Error('Ledger not found');
  }

  ledger.retryCount += 1;
  await saveLedger(getLedgerPath(stagingDirectory), ledger);

  return ledger;
}

/**
 * Clean up ledger file
 */
export async function cleanupLedger(stagingDirectory: string): Promise<void> {
  const ledgerPath = getLedgerPath(stagingDirectory);

  try {
    await fs.unlink(ledgerPath);
    logger.info(`Cleaned up ledger file: ${ledgerPath}`);
  } catch (error: unknown) {
    if ((error as { code?: string }).code !== 'ENOENT') {
      logger.error(`Failed to cleanup ledger file: ${error}`);
      throw error;
    }
  }
}

export default {
  initializeLedger,
  loadLedger,
  saveLedger,
  updateFileStatus,
  updatePhase,
  markFileGenerated,
  markFileReplaced,
  markFileFailed,
  getFilesNeedingGeneration,
  getFilesNeedingReplacement,
  isGenerationComplete,
  isReplacementComplete,
  incrementRetryCount,
  cleanupLedger,
};
