/**
 * File Paths Configuration Module
 *
 * Manages file paths for atomic file generation operations.
 * Supports configuration via JSON file or environment variables.
 *
 * Environment variables:
 *   OCC_GEO_JOB_TARGET_DIRECTORY - Original directory containing existing files
 *     (fallback: TARGET_DIRECTORY)
 *   OCC_GEO_JOB_STAGING_DIRECTORY - Temporary directory for new files before
 *     atomic replacement (fallback: STAGING_DIRECTORY)
 *   OCC_GEO_JOB_FILE_PATHS_CONFIG - Path to JSON file containing file path
 *     configurations (fallback: FILE_PATHS_CONFIG)
 */

import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '@/utils/index.js';

/**
 * Interface for file path configuration
 */
export interface FilePathConfig {
  /** Base target directory for final files */
  targetDirectory: string;
  /** Staging directory for temporary files during generation */
  stagingDirectory: string;
  /** Output file paths relative to their directories */
  files: {
    dataJson: string;
    dataGeojson: string;
    presenceGeojson: string;
    absenceGeojson: string;
  };
}

/**
 * Default file paths configuration
 * Uses relative paths that will be resolved to absolute paths at runtime
 */
export const DEFAULT_CONFIG: FilePathConfig = {
  targetDirectory: '.tmp/target',
  stagingDirectory: '.tmp/staging',
  files: {
    dataJson: 'data.json',
    dataGeojson: 'data.geojson',
    presenceGeojson: 'presence.geojson',
    absenceGeojson: 'absence.geojson',
  },
};

/**
 * Load configuration from JSON file
 */
async function loadConfigFromFile(configPath: string): Promise<FilePathConfig> {
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(content) as FilePathConfig;

    // Validate required fields
    if (!config.targetDirectory || !config.stagingDirectory || !config.files) {
      throw new Error('Invalid configuration file: missing required fields');
    }

    // Validate file paths
    const requiredFiles = [
      'dataJson',
      'dataGeojson',
      'presenceGeojson',
      'absenceGeojson',
    ];
    for (const fileKey of requiredFiles) {
      if (!config.files[fileKey as keyof typeof config.files]) {
        throw new Error(
          `Invalid configuration: missing file path for ${fileKey}`,
        );
      }
    }

    logger.info(`Loaded file paths configuration from ${configPath}`);
    return config;
  } catch (error) {
    logger.error(`Failed to load configuration from ${configPath}: ${error}`);
    throw error;
  }
}

/**
 * Load configuration from environment variables
 */
function loadConfigFromEnv(): Partial<FilePathConfig> {
  const config: Partial<FilePathConfig> = {};

  const targetDir =
    process.env.OCC_GEO_JOB_TARGET_DIRECTORY || process.env.TARGET_DIRECTORY;
  if (targetDir) {
    config.targetDirectory = targetDir;
  }

  const stagingDir =
    process.env.OCC_GEO_JOB_STAGING_DIRECTORY || process.env.STAGING_DIRECTORY;
  if (stagingDir) {
    config.stagingDirectory = stagingDir;
  }

  return config;
}

/**
 * Merges configurations with defaults
 */
function mergeConfig(
  envConfig: Partial<FilePathConfig>,
  fileConfig?: FilePathConfig,
): FilePathConfig {
  const base = fileConfig || DEFAULT_CONFIG;

  return {
    targetDirectory: envConfig.targetDirectory || base.targetDirectory,
    stagingDirectory: envConfig.stagingDirectory || base.stagingDirectory,
    files: base.files, // Files come from config file or defaults
  };
}

/**
 * Get resolved file paths configuration
 */
export async function getFilePathsConfig(): Promise<FilePathConfig> {
  let fileConfig: FilePathConfig | undefined;

  // Try to load from JSON config file if specified
  const filePathsConfig =
    process.env.OCC_GEO_JOB_FILE_PATHS_CONFIG || process.env.FILE_PATHS_CONFIG;
  if (filePathsConfig) {
    try {
      fileConfig = await loadConfigFromFile(filePathsConfig);
    } catch (error) {
      logger.warn(
        `Using default configuration due to error loading config file: ${error}`,
      );
      // Don't throw - allow fallback to defaults or env vars
      // Note: If strict validation is needed, uncomment the following line:
      // throw error;
    }
  }

  // Load environment variables
  const envConfig = loadConfigFromEnv();

  // Merge configurations
  const config = mergeConfig(envConfig, fileConfig);

  // Ensure directories are absolute paths
  config.targetDirectory = path.isAbsolute(config.targetDirectory)
    ? config.targetDirectory
    : path.resolve(process.cwd(), config.targetDirectory);

  config.stagingDirectory = path.isAbsolute(config.stagingDirectory)
    ? config.stagingDirectory
    : path.resolve(process.cwd(), config.stagingDirectory);

  return config;
}

/**
 * Get absolute file paths for both staging and target directories
 */
export function getAbsoluteFilePaths(config: FilePathConfig): {
  target: {
    dataJson: string;
    dataGeojson: string;
    presenceGeojson: string;
    absenceGeojson: string;
  };
  staging: {
    dataJson: string;
    dataGeojson: string;
    presenceGeojson: string;
    absenceGeojson: string;
  };
} {
  return {
    target: {
      dataJson: path.join(config.targetDirectory, config.files.dataJson),
      dataGeojson: path.join(config.targetDirectory, config.files.dataGeojson),
      presenceGeojson: path.join(
        config.targetDirectory,
        config.files.presenceGeojson,
      ),
      absenceGeojson: path.join(
        config.targetDirectory,
        config.files.absenceGeojson,
      ),
    },
    staging: {
      dataJson: path.join(config.stagingDirectory, config.files.dataJson),
      dataGeojson: path.join(config.stagingDirectory, config.files.dataGeojson),
      presenceGeojson: path.join(
        config.stagingDirectory,
        config.files.presenceGeojson,
      ),
      absenceGeojson: path.join(
        config.stagingDirectory,
        config.files.absenceGeojson,
      ),
    },
  };
}

/**
 * Create directories if they don't exist
 */
export async function ensureDirectoriesExist(
  config: FilePathConfig,
): Promise<void> {
  const directories = [config.targetDirectory, config.stagingDirectory];

  for (const dir of directories) {
    try {
      await fs.mkdir(dir, { recursive: true });
      logger.info(`Ensured directory exists: ${dir}`);
    } catch (error: unknown) {
      if ((error as { code?: string }).code !== 'EEXIST') {
        logger.error(`Failed to create directory ${dir}: ${error}`);
        throw error;
      }
    }
  }
}

export default {
  getFilePathsConfig,
  getAbsoluteFilePaths,
  ensureDirectoriesExist,
  DEFAULT_CONFIG,
};
