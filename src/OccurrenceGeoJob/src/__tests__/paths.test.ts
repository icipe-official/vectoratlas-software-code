/**
 * File Paths Configuration Tests
 *
 * Tests for file path configuration and management.
 */

import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  getFilePathsConfig,
  getAbsoluteFilePaths,
  ensureDirectoriesExist,
  DEFAULT_CONFIG,
  type FilePathConfig,
} from '@/config/index.js';

// Helper to create temporary test directory
async function createTestDir(): Promise<{
  dir: string;
  cleanup: () => Promise<void>;
}> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'paths-test-'));
  return {
    dir: tempDir,
    cleanup: async () => {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors
      }
    },
  };
}

// Helper to create a temporary config file
async function createConfigFile(
  dir: string,
  config: FilePathConfig,
): Promise<string> {
  const configPath = path.join(dir, 'test-config.json');
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));
  return configPath;
}

describe('File Paths Configuration', () => {
  let testDir: string;
  let cleanup: () => Promise<void>;
  let originalEnv: Record<string, string | undefined>;

  beforeEach(async () => {
    const testEnv = await createTestDir();
    testDir = testEnv.dir;
    cleanup = testEnv.cleanup;

    // Save and clear original environment variables
    originalEnv = {
      FILE_PATHS_CONFIG: process.env.FILE_PATHS_CONFIG,
      TARGET_DIRECTORY: process.env.TARGET_DIRECTORY,
      STAGING_DIRECTORY: process.env.STAGING_DIRECTORY,
    };

    // Clear environment variables for clean test state
    delete process.env.FILE_PATHS_CONFIG;
    delete process.env.TARGET_DIRECTORY;
    delete process.env.STAGING_DIRECTORY;
  });

  afterEach(async () => {
    await cleanup();

    // Restore original environment variables
    process.env.FILE_PATHS_CONFIG = originalEnv.FILE_PATHS_CONFIG;
    process.env.TARGET_DIRECTORY = originalEnv.TARGET_DIRECTORY;
    process.env.STAGING_DIRECTORY = originalEnv.STAGING_DIRECTORY;
  });

  describe('DEFAULT_CONFIG', () => {
    it('should have correct default values', () => {
      // DEFAULT_CONFIG uses relative paths that are resolved at runtime
      expect(DEFAULT_CONFIG.targetDirectory).toBe('.tmp/target');
      expect(DEFAULT_CONFIG.stagingDirectory).toBe('.tmp/staging');
      expect(DEFAULT_CONFIG.files.dataJson).toBe('data.json');
      expect(DEFAULT_CONFIG.files.dataGeojson).toBe('data.geojson');
      expect(DEFAULT_CONFIG.files.presenceGeojson).toBe('presence.geojson');
      expect(DEFAULT_CONFIG.files.absenceGeojson).toBe('absence.geojson');
    });
  });

  describe('getFilePathsConfig', () => {
    it('should return default configuration when no config file or env vars', async () => {
      // Clear any environment variables
      delete process.env.FILE_PATHS_CONFIG;
      delete process.env.TARGET_DIRECTORY;
      delete process.env.STAGING_DIRECTORY;

      const config = await getFilePathsConfig();

      expect(config.targetDirectory).toBe(
        path.join(process.cwd(), '.tmp', 'target'),
      );
      expect(config.stagingDirectory).toBe(
        path.join(process.cwd(), '.tmp', 'staging'),
      );
      expect(config.files.dataJson).toBe('data.json');
      expect(config.files.dataGeojson).toBe('data.geojson');
      expect(config.files.presenceGeojson).toBe('presence.geojson');
      expect(config.files.absenceGeojson).toBe('absence.geojson');
    });

    it('should load configuration from JSON file when FILE_PATHS_CONFIG is set', async () => {
      const customConfig: FilePathConfig = {
        targetDirectory: '/custom/target',
        stagingDirectory: '/custom/staging',
        files: {
          dataJson: 'custom-data.json',
          dataGeojson: 'custom-data.geojson',
          presenceGeojson: 'custom-presence.geojson',
          absenceGeojson: 'custom-absence.geojson',
        },
      };

      const configPath = await createConfigFile(testDir, customConfig);
      process.env.FILE_PATHS_CONFIG = configPath;

      const config = await getFilePathsConfig();

      expect(config.targetDirectory).toBe('/custom/target');
      expect(config.stagingDirectory).toBe('/custom/staging');
      expect(config.files.dataJson).toBe('custom-data.json');
      expect(config.files.dataGeojson).toBe('custom-data.geojson');
      expect(config.files.presenceGeojson).toBe('custom-presence.geojson');
      expect(config.files.absenceGeojson).toBe('custom-absence.geojson');
    });

    it('should override config file values with environment variables', async () => {
      const customConfig: FilePathConfig = {
        targetDirectory: '/config/target',
        stagingDirectory: '/config/staging',
        files: {
          dataJson: 'config-data.json',
          dataGeojson: 'config-data.geojson',
          presenceGeojson: 'config-presence.geojson',
          absenceGeojson: 'config-absence.geojson',
        },
      };

      const configPath = await createConfigFile(testDir, customConfig);
      process.env.FILE_PATHS_CONFIG = configPath;
      process.env.TARGET_DIRECTORY = '/env/target';
      process.env.STAGING_DIRECTORY = '/env/staging';

      const config = await getFilePathsConfig();

      // Environment variables should override config file
      expect(config.targetDirectory).toBe('/env/target');
      expect(config.stagingDirectory).toBe('/env/staging');
      // But file paths should come from config file
      expect(config.files.dataJson).toBe('config-data.json');
      expect(config.files.dataGeojson).toBe('config-data.geojson');
    });

    it('should use environment variables when no config file is specified', async () => {
      delete process.env.FILE_PATHS_CONFIG;
      process.env.TARGET_DIRECTORY = '/env-only/target';
      process.env.STAGING_DIRECTORY = '/env-only/staging';

      const config = await getFilePathsConfig();

      expect(config.targetDirectory).toBe('/env-only/target');
      expect(config.stagingDirectory).toBe('/env-only/staging');
      // File paths should be from defaults
      expect(config.files.dataJson).toBe('data.json');
      expect(config.files.dataGeojson).toBe('data.geojson');
    });

    it('should convert relative paths to absolute paths', async () => {
      delete process.env.FILE_PATHS_CONFIG;
      delete process.env.TARGET_DIRECTORY;
      delete process.env.STAGING_DIRECTORY;

      const config = await getFilePathsConfig();

      // Default paths should be absolute
      expect(path.isAbsolute(config.targetDirectory)).toBe(true);
      expect(path.isAbsolute(config.stagingDirectory)).toBe(true);
    });

    it('should handle invalid config file gracefully', async () => {
      // Create an invalid config file
      const invalidConfigPath = path.join(testDir, 'invalid-config.json');
      await fs.writeFile(invalidConfigPath, 'not valid json');

      process.env.FILE_PATHS_CONFIG = invalidConfigPath;

      // Should fall back to defaults
      const config = await getFilePathsConfig();
      expect(config.targetDirectory).toBe(
        path.join(process.cwd(), '.tmp', 'target'),
      );
      expect(config.stagingDirectory).toBe(
        path.join(process.cwd(), '.tmp', 'staging'),
      );
    });

    it('should handle missing required fields in config file', async () => {
      // Create a config file with missing fields
      const incompleteConfig: FilePathConfig = {
        targetDirectory: '/incomplete/target',
        stagingDirectory: '/incomplete/staging',
        files: {
          dataJson: 'data.json',
          dataGeojson: 'data.geojson',
          presenceGeojson: 'presence.geojson',
          absenceGeojson: 'absence.geojson',
        },
      };
      // Manually remove fields to simulate incomplete config
      const configToWrite = {
        targetDirectory: '/incomplete/target',
      };

      const configPath = await createConfigFile(
        testDir,
        configToWrite as FilePathConfig,
      );
      process.env.FILE_PATHS_CONFIG = configPath;

      // Should fall back to defaults when config file is invalid
      // Note: With strict validation, the entire config file is rejected
      const config = await getFilePathsConfig();
      expect(config.targetDirectory).toBe(
        path.join(process.cwd(), '.tmp', 'target'),
      );
      expect(config.stagingDirectory).toBe(
        path.join(process.cwd(), '.tmp', 'staging'),
      );
    });

    it('should handle missing file paths in config file', async () => {
      // Create a config file with missing file paths
      const completeConfig: FilePathConfig = {
        targetDirectory: '/incomplete/target',
        stagingDirectory: '/incomplete/staging',
        files: {
          dataJson: 'custom-data.json',
          dataGeojson: 'custom-data.geojson',
          presenceGeojson: 'custom-presence.geojson',
          absenceGeojson: 'custom-absence.geojson',
        },
      };
      // Manually create incomplete config to write
      const configToWrite = {
        targetDirectory: '/incomplete/target',
        stagingDirectory: '/incomplete/staging',
        files: {
          dataJson: 'custom-data.json',
        },
      };

      const configPath = await createConfigFile(
        testDir,
        configToWrite as FilePathConfig,
      );
      process.env.FILE_PATHS_CONFIG = configPath;

      // Should fall back to defaults when config file is invalid (missing file paths)
      // Note: With strict validation, the entire config file is rejected
      const config = await getFilePathsConfig();
      expect(config.targetDirectory).toBe(
        path.join(process.cwd(), '.tmp', 'target'),
      );
      expect(config.stagingDirectory).toBe(
        path.join(process.cwd(), '.tmp', 'staging'),
      );
      // All file paths should be defaults
      expect(config.files.dataJson).toBe('data.json');
      expect(config.files.dataGeojson).toBe('data.geojson');
      expect(config.files.presenceGeojson).toBe('presence.geojson');
      expect(config.files.absenceGeojson).toBe('absence.geojson');
    });

    it('should use cwd for relative paths', async () => {
      delete process.env.FILE_PATHS_CONFIG;
      delete process.env.TARGET_DIRECTORY;
      delete process.env.STAGING_DIRECTORY;

      // Change to test directory temporarily
      const originalCwd = process.cwd();
      process.chdir(testDir);

      try {
        const config = await getFilePathsConfig();

        // Paths should be resolved from cwd (which is now testDir)
        expect(config.targetDirectory).toBe(
          path.join(testDir, '.tmp', 'target'),
        );
        expect(config.stagingDirectory).toBe(
          path.join(testDir, '.tmp', 'staging'),
        );
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('getAbsoluteFilePaths', () => {
    it('should return absolute paths for all files in both directories', async () => {
      const config: FilePathConfig = {
        targetDirectory: '/base/target',
        stagingDirectory: '/base/staging',
        files: {
          dataJson: 'data.json',
          dataGeojson: 'data.geojson',
          presenceGeojson: 'presence.geojson',
          absenceGeojson: 'absence.geojson',
        },
      };

      const absolutePaths = getAbsoluteFilePaths(config);

      expect(absolutePaths.target.dataJson).toBe('/base/target/data.json');
      expect(absolutePaths.target.dataGeojson).toBe(
        '/base/target/data.geojson',
      );
      expect(absolutePaths.target.presenceGeojson).toBe(
        '/base/target/presence.geojson',
      );
      expect(absolutePaths.target.absenceGeojson).toBe(
        '/base/target/absence.geojson',
      );

      expect(absolutePaths.staging.dataJson).toBe('/base/staging/data.json');
      expect(absolutePaths.staging.dataGeojson).toBe(
        '/base/staging/data.geojson',
      );
      expect(absolutePaths.staging.presenceGeojson).toBe(
        '/base/staging/presence.geojson',
      );
      expect(absolutePaths.staging.absenceGeojson).toBe(
        '/base/staging/absence.geojson',
      );
    });

    it('should handle relative paths in files', async () => {
      const config: FilePathConfig = {
        targetDirectory: '/base/target',
        stagingDirectory: '/base/staging',
        files: {
          dataJson: 'subdir/data.json',
          dataGeojson: 'subdir/data.geojson',
          presenceGeojson: 'subdir/presence.geojson',
          absenceGeojson: 'subdir/absence.geojson',
        },
      };

      const absolutePaths = getAbsoluteFilePaths(config);

      expect(absolutePaths.target.dataJson).toBe(
        '/base/target/subdir/data.json',
      );
      expect(absolutePaths.staging.dataJson).toBe(
        '/base/staging/subdir/data.json',
      );
    });
  });

  describe('ensureDirectoriesExist', () => {
    it('should create directories that do not exist', async () => {
      const config: FilePathConfig = {
        targetDirectory: path.join(testDir, 'new-target'),
        stagingDirectory: path.join(testDir, 'new-staging'),
        files: {
          dataJson: 'data.json',
          dataGeojson: 'data.geojson',
          presenceGeojson: 'presence.geojson',
          absenceGeojson: 'absence.geojson',
        },
      };

      await ensureDirectoriesExist(config);

      // Verify directories were created
      const targetStat = await fs.stat(config.targetDirectory);
      const stagingStat = await fs.stat(config.stagingDirectory);

      expect(targetStat.isDirectory()).toBe(true);
      expect(stagingStat.isDirectory()).toBe(true);
    });

    it('should not throw error if directories already exist', async () => {
      const config: FilePathConfig = {
        targetDirectory: testDir,
        stagingDirectory: testDir,
        files: {
          dataJson: 'data.json',
          dataGeojson: 'data.geojson',
          presenceGeojson: 'presence.geojson',
          absenceGeojson: 'absence.geojson',
        },
      };

      await expect(ensureDirectoriesExist(config)).resolves.not.toThrow();
    });

    it('should create nested directories', async () => {
      const config: FilePathConfig = {
        targetDirectory: path.join(testDir, 'nested', 'deep', 'target'),
        stagingDirectory: path.join(testDir, 'nested', 'deep', 'staging'),
        files: {
          dataJson: 'data.json',
          dataGeojson: 'data.geojson',
          presenceGeojson: 'presence.geojson',
          absenceGeojson: 'absence.geojson',
        },
      };

      await ensureDirectoriesExist(config);

      const targetStat = await fs.stat(config.targetDirectory);
      const stagingStat = await fs.stat(config.stagingDirectory);

      expect(targetStat.isDirectory()).toBe(true);
      expect(stagingStat.isDirectory()).toBe(true);
    });
  });
});
