/**
 * Integration Tests
 *
 * End-to-end tests for the atomic file generation workflow with ledger tracking
 * and resume capability.
 */

import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  initializeLedger,
  loadLedger,
  updatePhase,
  markFileReplaced,
  markFileFailed,
  getFilesNeedingGeneration,
  getFilesNeedingReplacement,
  isGenerationComplete,
  isReplacementComplete,
  cleanupLedger,
  atomicReplaceAll,
  atomicReplaceWithLedger,
  writeToStagingWithLedger,
  calculateChecksum,
} from '@/config/index.js';

// Helper to create temporary test directory
async function createTestDir(): Promise<{
  dir: string;
  cleanup: () => Promise<void>;
}> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'integration-test-'));
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

// Sample data for testing
const sampleOccurrenceData = [
  { id: 1, lat: 0, lon: 0, presence: true, date: '2023-01-01' },
  { id: 2, lat: 1, lon: 1, presence: true, date: '2023-01-02' },
  { id: 3, lat: -1, lon: -1, presence: false, date: '2023-01-03' },
];

const sampleGeoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 1 },
      geometry: { type: 'Point', coordinates: [0, 0] },
    },
    {
      type: 'Feature',
      properties: { id: 2 },
      geometry: { type: 'Point', coordinates: [1, 1] },
    },
  ],
};

const samplePresenceGeoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 1 },
      geometry: { type: 'Point', coordinates: [0, 0] },
    },
  ],
};

const sampleAbsenceGeoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 3 },
      geometry: { type: 'Point', coordinates: [-1, -1] },
    },
  ],
};

describe('Integration Tests - Complete Workflow', () => {
  let testDir: string;
  let stagingDir: string;
  let targetDir: string;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    const testEnv = await createTestDir();
    testDir = testEnv.dir;
    stagingDir = path.join(testDir, 'staging');
    targetDir = path.join(testDir, 'target');
    cleanup = testEnv.cleanup;

    await fs.mkdir(stagingDir, { recursive: true });
    await fs.mkdir(targetDir, { recursive: true });
  });

  afterEach(async () => {
    await cleanup();
  });

  describe('Complete Workflow', () => {
    it('should complete full workflow from initialization to atomic replacement', async () => {
      // Step 1: Initialize ledger
      const filenames = [
        'data.json',
        'data.geojson',
        'presence.geojson',
        'absence.geojson',
      ];
      const ledger = await initializeLedger(stagingDir, filenames);
      expect(ledger.phase).toBe('not_started');
      expect(ledger.totalFiles).toBe(4);

      // Step 2: Update phase to generation in progress
      await updatePhase(stagingDir, 'generation_in_progress');
      const ledgerAfterPhase = await loadLedger(stagingDir);
      expect(ledgerAfterPhase?.phase).toBe('generation_in_progress');

      // Step 3: Write files to staging
      await writeToStagingWithLedger(
        stagingDir,
        'data.json',
        sampleOccurrenceData,
      );
      await writeToStagingWithLedger(stagingDir, 'data.geojson', sampleGeoJson);
      await writeToStagingWithLedger(
        stagingDir,
        'presence.geojson',
        samplePresenceGeoJson,
      );
      await writeToStagingWithLedger(
        stagingDir,
        'absence.geojson',
        sampleAbsenceGeoJson,
      );

      // Verify files exist in staging
      expect(await fs.stat(path.join(stagingDir, 'data.json'))).toBeDefined();
      expect(
        await fs.stat(path.join(stagingDir, 'data.geojson')),
      ).toBeDefined();
      expect(
        await fs.stat(path.join(stagingDir, 'presence.geojson')),
      ).toBeDefined();
      expect(
        await fs.stat(path.join(stagingDir, 'absence.geojson')),
      ).toBeDefined();

      // Verify ledger was updated
      const ledgerAfterWrite = await loadLedger(stagingDir);
      {
        const dataJson = ledgerAfterWrite?.files['data.json'];
        const dataGeojson = ledgerAfterWrite?.files['data.geojson'];
        const presenceGeojson = ledgerAfterWrite?.files['presence.geojson'];
        const absenceGeojson = ledgerAfterWrite?.files['absence.geojson'];
        expect(dataJson).toBeDefined();
        expect(dataGeojson).toBeDefined();
        expect(presenceGeojson).toBeDefined();
        expect(absenceGeojson).toBeDefined();
        expect(dataJson!.status).toBe('generated');
        expect(dataGeojson!.status).toBe('generated');
        expect(presenceGeojson!.status).toBe('generated');
        expect(absenceGeojson!.status).toBe('generated');
      }

      // Step 4: Check generation completion
      const isGenComplete = await isGenerationComplete(stagingDir);
      expect(isGenComplete).toBe(true);

      // Step 5: Update phase to generation complete
      await updatePhase(stagingDir, 'generation_complete');

      // Step 6: Perform atomic replacement
      const replaceResult = await atomicReplaceWithLedger(
        stagingDir,
        targetDir,
        filenames,
        { createBackup: false, cleanupStaging: true },
      );

      expect(replaceResult.success).toBe(true);
      expect(replaceResult.resumed).toBe(false);
      expect(replaceResult.replacedFiles).toEqual(filenames);
      expect(replaceResult.failedFiles).toEqual([]);

      // Verify files exist in target
      expect(await fs.stat(path.join(targetDir, 'data.json'))).toBeDefined();
      expect(await fs.stat(path.join(targetDir, 'data.geojson'))).toBeDefined();
      expect(
        await fs.stat(path.join(targetDir, 'presence.geojson')),
      ).toBeDefined();
      expect(
        await fs.stat(path.join(targetDir, 'absence.geojson')),
      ).toBeDefined();

      // Verify files are removed from staging (cleanup enabled)
      expect(
        await fs.stat(path.join(stagingDir, 'data.json')).catch(() => null),
      ).toBeNull();

      // Verify ledger phase is completed
      const finalLedger = await loadLedger(stagingDir);
      expect(finalLedger?.phase).toBe('completed');
      const dataJson = finalLedger?.files['data.json'];
      const dataGeojson = finalLedger?.files['data.geojson'];
      expect(dataJson).toBeDefined();
      expect(dataGeojson).toBeDefined();
      expect(dataJson!.status).toBe('replaced');
      expect(dataGeojson!.status).toBe('replaced');

      // Verify replacement completion
      const isReplaceComplete = await isReplacementComplete(stagingDir);
      expect(isReplaceComplete).toBe(true);
    });

    it('should handle partial completion and resume correctly', async () => {
      const filenames = [
        'data.json',
        'data.geojson',
        'presence.geojson',
        'absence.geojson',
      ];

      // Step 1: Initialize and write all files
      await initializeLedger(stagingDir, filenames);
      await updatePhase(stagingDir, 'generation_in_progress');

      await writeToStagingWithLedger(
        stagingDir,
        'data.json',
        sampleOccurrenceData,
      );
      await writeToStagingWithLedger(stagingDir, 'data.geojson', sampleGeoJson);
      await writeToStagingWithLedger(
        stagingDir,
        'presence.geojson',
        samplePresenceGeoJson,
      );
      await writeToStagingWithLedger(
        stagingDir,
        'absence.geojson',
        sampleAbsenceGeoJson,
      );

      await updatePhase(stagingDir, 'generation_complete');

      // Step 2: Perform partial atomic replacement (simulate interruption)
      // First, replace only some files manually
      await atomicReplaceAll(
        stagingDir,
        targetDir,
        ['data.json', 'data.geojson'],
        {
          createBackup: false,
          cleanupStaging: false,
        },
      );

      // Mark files as replaced in ledger
      await markFileReplaced(stagingDir, 'data.json');
      await markFileReplaced(stagingDir, 'data.geojson');

      // Verify which files need replacement
      const filesNeedingReplacement =
        await getFilesNeedingReplacement(stagingDir);
      expect(filesNeedingReplacement).toEqual([
        'presence.geojson',
        'absence.geojson',
      ]);

      // Step 3: Resume atomic replacement
      const resumeResult = await atomicReplaceWithLedger(
        stagingDir,
        targetDir,
        filenames,
        { createBackup: false, cleanupStaging: true },
      );

      expect(resumeResult.success).toBe(true);
      expect(resumeResult.resumed).toBe(true);
      expect(resumeResult.replacedFiles).toEqual([
        'presence.geojson',
        'absence.geojson',
      ]);

      // Verify all files exist in target
      for (const filename of filenames) {
        expect(await fs.stat(path.join(targetDir, filename))).toBeDefined();
      }

      // Verify ledger is completed
      const finalLedger = await loadLedger(stagingDir);
      expect(finalLedger?.phase).toBe('completed');
      expect(isReplacementComplete(stagingDir)).resolves.toBe(true);
    });

    it('should handle file generation failures gracefully', async () => {
      const filenames = ['data.json', 'data.geojson'];

      // Initialize ledger
      await initializeLedger(stagingDir, filenames);
      await updatePhase(stagingDir, 'generation_in_progress');

      // Write one file successfully
      await writeToStagingWithLedger(
        stagingDir,
        'data.json',
        sampleOccurrenceData,
      );

      // Simulate failure for second file by marking it as failed
      await markFileFailed(
        stagingDir,
        'data.geojson',
        'Database connection error',
      );

      // Check which files need generation
      const filesNeedingGen = await getFilesNeedingGeneration(stagingDir);
      expect(filesNeedingGen).toEqual(['data.geojson']);

      // Check generation completion
      const isComplete = await isGenerationComplete(stagingDir);
      expect(isComplete).toBe(false);

      // Resume generation for failed file
      await writeToStagingWithLedger(stagingDir, 'data.geojson', sampleGeoJson);

      // Now check completion
      const isCompleteAfterResume = await isGenerationComplete(stagingDir);
      expect(isCompleteAfterResume).toBe(true);

      // Proceed with atomic replacement
      await updatePhase(stagingDir, 'generation_complete');

      const replaceResult = await atomicReplaceWithLedger(
        stagingDir,
        targetDir,
        filenames,
        { createBackup: false, cleanupStaging: true },
      );

      expect(replaceResult.success).toBe(true);
      expect(replaceResult.failedFiles).toEqual([]);
    });
  });

  describe('Resume Scenarios', () => {
    it('should resume from generation_in_progress phase', async () => {
      const filenames = ['data.json', 'data.geojson'];

      // Start generation
      await initializeLedger(stagingDir, filenames);
      await updatePhase(stagingDir, 'generation_in_progress');

      // Write one file
      await writeToStagingWithLedger(
        stagingDir,
        'data.json',
        sampleOccurrenceData,
      );

      // Simulate interruption - no updatePhase to generation_complete

      // Resume: Check state
      const ledger = await loadLedger(stagingDir);
      expect(ledger?.phase).toBe('generation_in_progress');
      const dataJson = ledger?.files['data.json'];
      const dataGeojson = ledger?.files['data.geojson'];
      expect(dataJson).toBeDefined();
      expect(dataGeojson).toBeDefined();
      expect(dataJson!.status).toBe('generated');
      expect(dataGeojson!.status).toBe('pending');

      // Resume generation
      await writeToStagingWithLedger(stagingDir, 'data.geojson', sampleGeoJson);

      // Check if generation is complete
      const isComplete = await isGenerationComplete(stagingDir);
      expect(isComplete).toBe(true);

      // Continue to replacement
      await updatePhase(stagingDir, 'generation_complete');

      const replaceResult = await atomicReplaceWithLedger(
        stagingDir,
        targetDir,
        filenames,
        { createBackup: false, cleanupStaging: true },
      );

      expect(replaceResult.success).toBe(true);
    });

    it('should handle ledger persistence across process restarts', async () => {
      const filenames = ['data.json', 'data.geojson'];

      // First session
      await initializeLedger(stagingDir, filenames);
      await updatePhase(stagingDir, 'generation_in_progress');
      await writeToStagingWithLedger(
        stagingDir,
        'data.json',
        sampleOccurrenceData,
      );
      await updatePhase(stagingDir, 'generation_complete');
      await atomicReplaceAll(stagingDir, targetDir, ['data.json'], {
        createBackup: false,
        cleanupStaging: false,
      });
      await markFileReplaced(stagingDir, 'data.json');

      // Second session (simulated by reloading ledger)
      const ledger = await loadLedger(stagingDir);
      expect(ledger).not.toBeNull();
      expect(ledger?.phase).toBe('generation_complete');
      const dataJson = ledger?.files['data.json'];
      const dataGeojson = ledger?.files['data.geojson'];
      expect(dataJson).toBeDefined();
      expect(dataGeojson).toBeDefined();
      expect(dataJson!.status).toBe('replaced');
      expect(dataGeojson!.status).toBe('generated');

      // Resume replacement
      const filesToReplace = await getFilesNeedingReplacement(stagingDir);
      expect(filesToReplace).toEqual(['data.geojson']);

      // Complete replacement
      await atomicReplaceAll(stagingDir, targetDir, ['data.geojson'], {
        createBackup: false,
        cleanupStaging: true,
      });
      await markFileReplaced(stagingDir, 'data.geojson');

      // Verify completion
      const isComplete = await isReplacementComplete(stagingDir);
      expect(isComplete).toBe(true);
    });
  });

  describe('Backup and Rollback Scenarios', () => {
    it('should create backups before atomic replacement', async () => {
      const filenames = ['data.json'];

      // Create existing file in target
      const existingContent = { data: 'existing' };
      await fs.writeFile(
        path.join(targetDir, 'data.json'),
        JSON.stringify(existingContent, null, 2),
      );

      // Initialize and generate new file
      await initializeLedger(stagingDir, filenames);
      await updatePhase(stagingDir, 'generation_in_progress');
      await writeToStagingWithLedger(
        stagingDir,
        'data.json',
        sampleOccurrenceData,
      );
      await updatePhase(stagingDir, 'generation_complete');

      // Perform atomic replacement with backup
      const backupDir = path.join(testDir, 'backups');
      const replaceResult = await atomicReplaceWithLedger(
        stagingDir,
        targetDir,
        filenames,
        {
          createBackup: true,
          backupDirectory: backupDir,
          cleanupStaging: true,
        },
      );

      expect(replaceResult.success).toBe(true);

      // Verify backup was created
      const backupFiles = await fs.readdir(backupDir);
      expect(backupFiles.length).toBe(1);

      const backupContent = JSON.parse(
        await fs.readFile(path.join(backupDir, backupFiles[0]!), 'utf-8'),
      );
      expect(backupContent).toEqual(existingContent);

      // Verify target has new content
      const targetContent = JSON.parse(
        await fs.readFile(path.join(targetDir, 'data.json'), 'utf-8'),
      );
      expect(targetContent).toEqual(sampleOccurrenceData);
    });

    it('should handle checksum verification for atomic replacement', async () => {
      const filenames = ['data.json'];

      await initializeLedger(stagingDir, filenames);
      await updatePhase(stagingDir, 'generation_in_progress');
      await writeToStagingWithLedger(
        stagingDir,
        'data.json',
        sampleOccurrenceData,
      );
      await updatePhase(stagingDir, 'generation_complete');

      // Verify checksum was calculated during write
      const ledgerAfterWrite = await loadLedger(stagingDir);
      const dataJson = ledgerAfterWrite?.files['data.json'];
      expect(dataJson).toBeDefined();
      const originalChecksum = dataJson!.checksum;
      expect(originalChecksum).toBeDefined();

      // Perform atomic replacement with checksum verification
      const replaceResult = await atomicReplaceWithLedger(
        stagingDir,
        targetDir,
        filenames,
        {
          createBackup: false,
          verifyChecksums: true,
          cleanupStaging: false, // Keep staging file for verification
        },
      );

      expect(replaceResult.success).toBe(true);

      // Verify staging file checksum matches
      const stagingFilePath = path.join(stagingDir, 'data.json');
      const calculatedChecksum = await calculateChecksum(stagingFilePath);
      expect(calculatedChecksum).toBe(originalChecksum);
    });
  });

  describe('Error Recovery', () => {
    it('should recover from atomic replacement failure', async () => {
      const filenames = ['data.json', 'data.geojson'];

      await initializeLedger(stagingDir, filenames);
      await updatePhase(stagingDir, 'generation_in_progress');
      await writeToStagingWithLedger(
        stagingDir,
        'data.json',
        sampleOccurrenceData,
      );
      await writeToStagingWithLedger(stagingDir, 'data.geojson', sampleGeoJson);
      await updatePhase(stagingDir, 'generation_complete');

      // Simulate failure by removing one staging file
      await fs.unlink(path.join(stagingDir, 'data.geojson'));

      // Attempt atomic replacement - should fail
      const failedResult = await atomicReplaceWithLedger(
        stagingDir,
        targetDir,
        filenames,
        { createBackup: false, cleanupStaging: false },
      );

      expect(failedResult.success).toBe(false);
      expect(failedResult.failedFiles).toContain('data.geojson');

      // Verify ledger phase is failed
      const ledgerAfterFailure = await loadLedger(stagingDir);
      expect(ledgerAfterFailure?.phase).toBe('failed');
      const dataJson = ledgerAfterFailure?.files['data.json'];
      const dataGeojson = ledgerAfterFailure?.files['data.geojson'];
      expect(dataJson).toBeDefined();
      expect(dataGeojson).toBeDefined();
      expect(dataJson!.status).toBe('replaced'); // Successfully replaced
      expect(dataGeojson!.status).toBe('failed'); // Failed

      // Verify partially replaced file exists in target
      expect(await fs.stat(path.join(targetDir, 'data.json'))).toBeDefined();

      // Recover by regenerating the failed file
      await writeToStagingWithLedger(stagingDir, 'data.geojson', sampleGeoJson);

      // Update ledger to mark generation complete again
      await updatePhase(stagingDir, 'generation_complete');

      // Resume replacement
      const resumeResult = await atomicReplaceWithLedger(
        stagingDir,
        targetDir,
        filenames,
        { createBackup: false, cleanupStaging: true },
      );

      // Should successfully replace the remaining file
      expect(resumeResult.success).toBe(true);
      expect(resumeResult.resumed).toBe(true);
      expect(resumeResult.replacedFiles).toContain('data.geojson');

      // Verify completion
      const finalLedger = await loadLedger(stagingDir);
      expect(finalLedger?.phase).toBe('completed');
    });

    it('should clean up ledger file after successful completion', async () => {
      const filenames = ['data.json'];

      await initializeLedger(stagingDir, filenames);
      await updatePhase(stagingDir, 'generation_in_progress');
      await writeToStagingWithLedger(
        stagingDir,
        'data.json',
        sampleOccurrenceData,
      );
      await updatePhase(stagingDir, 'generation_complete');
      await atomicReplaceWithLedger(stagingDir, targetDir, filenames, {
        createBackup: false,
        cleanupStaging: true,
      });

      // Verify ledger file exists
      const ledgerPath = path.join(stagingDir, '.generation_ledger.json');
      expect(await fs.stat(ledgerPath)).toBeDefined();

      // Clean up ledger
      await cleanupLedger(stagingDir);

      // Verify ledger file is removed
      expect(await fs.stat(ledgerPath).catch(() => null)).toBeNull();
    });
  });

  describe('Concurrent Execution Safety', () => {
    it('should handle multiple writes to the same file gracefully', async () => {
      const filenames = ['data.json'];

      await initializeLedger(stagingDir, filenames);

      // Write file multiple times (simulating retries or updates)
      const content1 = { data: 'version1' };
      const content2 = { data: 'version2' };
      const content3 = { data: 'version3' };

      await writeToStagingWithLedger(stagingDir, 'data.json', content1);
      await writeToStagingWithLedger(stagingDir, 'data.json', content2);
      await writeToStagingWithLedger(stagingDir, 'data.json', content3);

      // Verify final content
      const fileContent = JSON.parse(
        await fs.readFile(path.join(stagingDir, 'data.json'), 'utf-8'),
      );
      expect(fileContent).toEqual(content3);

      // Verify ledger has latest state
      const ledger = await loadLedger(stagingDir);
      const dataJson = ledger?.files['data.json'];
      expect(dataJson).toBeDefined();
      expect(dataJson!.status).toBe('generated');
      expect(dataJson!.size).toBeGreaterThan(0);
    });

    it('should preserve ledger integrity across multiple operations', async () => {
      const filenames = ['file1.json', 'file2.json', 'file3.json'];

      await initializeLedger(stagingDir, filenames);

      // Perform multiple concurrent-like operations
      const operations = [
        writeToStagingWithLedger(stagingDir, 'file1.json', { data: 'file1' }),
        writeToStagingWithLedger(stagingDir, 'file2.json', { data: 'file2' }),
        writeToStagingWithLedger(stagingDir, 'file3.json', { data: 'file3' }),
        updatePhase(stagingDir, 'generation_in_progress'),
      ];

      await Promise.all(operations);

      // Verify ledger state is consistent
      const ledger = await loadLedger(stagingDir);
      expect(ledger?.phase).toBe('generation_in_progress');
      const file1 = ledger?.files['file1.json'];
      const file2 = ledger?.files['file2.json'];
      const file3 = ledger?.files['file3.json'];
      expect(file1).toBeDefined();
      expect(file2).toBeDefined();
      expect(file3).toBeDefined();
      expect(file1!.status).toBe('generated');
      expect(file2!.status).toBe('generated');
      expect(file3!.status).toBe('generated');
    });
  });
});
