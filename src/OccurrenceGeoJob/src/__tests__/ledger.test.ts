/**
 * Ledger Module Tests
 *
 * Tests for the ledger tracking functionality that supports atomic file generation
 * and resumption of interrupted jobs.
 */

import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  initializeLedger,
  loadLedger,
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
  type LedgerState,
  type FileState,
} from '@/config/index.js';

// Helper to create temporary test directory
async function createTestDir(): Promise<{
  dir: string;
  cleanup: () => Promise<void>;
}> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ledger-test-'));
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

describe('Ledger Module', () => {
  let testDir: string;
  let cleanup: () => Promise<void>;

  beforeEach(async () => {
    const testEnv = await createTestDir();
    testDir = testEnv.dir;
    cleanup = testEnv.cleanup;
  });

  afterEach(async () => {
    await cleanup();
  });

  describe('initializeLedger', () => {
    it('should create a new ledger with default state', async () => {
      const filenames = ['file1.json', 'file2.geojson', 'file3.txt'];
      const ledger = await initializeLedger(testDir, filenames);

      expect(ledger.version).toBe('1.0.0');
      expect(ledger.phase).toBe('not_started');
      expect(ledger.totalFiles).toBe(3);
      expect(ledger.files).toHaveProperty('file1.json');
      expect(ledger.files).toHaveProperty('file2.geojson');
      expect(ledger.files).toHaveProperty('file3.txt');
      expect(ledger.startedAt).toBeDefined();
      expect(ledger.retryCount).toBe(0);

      // Check file states
      Object.values(ledger.files).forEach((fileState: FileState) => {
        expect(fileState!.status).toBe('pending');
        expect(fileState!.size).toBe(0);
        expect(fileState!.errorMessage).toBeUndefined();
        expect(fileState!.checksum).toBeUndefined();
      });
    });

    it('should create ledger file on disk', async () => {
      const filenames = ['test.json'];
      await initializeLedger(testDir, filenames);

      const ledgerPath = path.join(testDir, '.generation_ledger.json');
      expect(await fs.stat(ledgerPath)).toBeDefined();

      const content = await fs.readFile(ledgerPath, 'utf-8');
      const ledger = JSON.parse(content) as LedgerState;
      expect(ledger.phase).toBe('not_started');
      expect(ledger.totalFiles).toBe(1);
    });

    it('should handle empty filename array', async () => {
      const ledger = await initializeLedger(testDir, []);
      expect(ledger.totalFiles).toBe(0);
      expect(Object.keys(ledger.files).length).toBe(0);
    });
  });

  describe('loadLedger', () => {
    it('should load existing ledger from file', async () => {
      const filenames = ['file1.json'];
      const originalLedger = await initializeLedger(testDir, filenames);

      // Modify the ledger
      await updatePhase(testDir, 'generation_in_progress');

      const loadedLedger = await loadLedger(testDir);
      expect(loadedLedger).not.toBeNull();
      expect(loadedLedger?.phase).toBe('generation_in_progress');
      expect(loadedLedger?.totalFiles).toBe(1);
    });

    it('should return null if ledger file does not exist', async () => {
      const ledger = await loadLedger('/nonexistent/path');
      expect(ledger).toBeNull();
    });
  });

  describe('updatePhase', () => {
    it('should update ledger phase', async () => {
      const filenames = ['file1.json'];
      await initializeLedger(testDir, filenames);

      const updatedLedger = await updatePhase(
        testDir,
        'generation_in_progress',
      );
      expect(updatedLedger.phase).toBe('generation_in_progress');

      const loadedLedger = await loadLedger(testDir);
      expect(loadedLedger?.phase).toBe('generation_in_progress');
    });

    it('should set completedAt when phase is completed', async () => {
      const filenames = ['file1.json'];
      await initializeLedger(testDir, filenames);

      const updatedLedger = await updatePhase(testDir, 'completed');
      expect(updatedLedger.phase).toBe('completed');
      expect(updatedLedger.completedAt).toBeDefined();
    });

    it('should store error message when provided', async () => {
      const filenames = ['file1.json'];
      await initializeLedger(testDir, filenames);

      const errorMessage = 'Test error';
      const updatedLedger = await updatePhase(testDir, 'failed', errorMessage);
      expect(updatedLedger.phase).toBe('failed');
      expect(updatedLedger.errorMessage).toBe(errorMessage);
    });

    it('should throw error if ledger does not exist', async () => {
      await expect(
        updatePhase(testDir, 'generation_in_progress'),
      ).rejects.toThrow('Ledger not found');
    });
  });

  describe('updateFileStatus', () => {
    it('should update file status', async () => {
      const filenames = ['file1.json'];
      await initializeLedger(testDir, filenames);

      const updatedLedger = await updateFileStatus(testDir, 'file1.json', {
        status: 'generated',
        size: 1024,
        generatedAt: new Date().toISOString(),
      });

      const file1 = updatedLedger.files['file1.json'];
      expect(file1).toBeDefined();
      expect(file1!.status).toBe('generated');
      expect(file1!.size).toBe(1024);
      expect(file1!.generatedAt).toBeDefined();
    });

    it('should throw error if file does not exist in ledger', async () => {
      const filenames = ['file1.json'];
      await initializeLedger(testDir, filenames);

      await expect(
        updateFileStatus(testDir, 'nonexistent.json', { status: 'generated' }),
      ).rejects.toThrow('File nonexistent.json not found in ledger');
    });

    it('should merge updates with existing file state', async () => {
      const filenames = ['file1.json'];
      await initializeLedger(testDir, filenames);

      // First update
      await updateFileStatus(testDir, 'file1.json', {
        status: 'generated',
        size: 100,
      });

      // Second update
      const updatedLedger = await updateFileStatus(testDir, 'file1.json', {
        checksum: 'abc123',
        replacedAt: new Date().toISOString(),
      });

      const fileState = updatedLedger.files['file1.json'];
      expect(fileState!.status).toBe('generated'); // Preserved from first update
      expect(fileState!.size).toBe(100); // Preserved from first update
      expect(fileState!.checksum).toBe('abc123'); // Added from second update
      expect(fileState!.replacedAt).toBeDefined(); // Added from second update
    });
  });

  describe('markFileGenerated', () => {
    it('should mark file as generated with size and checksum', async () => {
      const filenames = ['file1.json'];
      await initializeLedger(testDir, filenames);

      const ledger = await markFileGenerated(
        testDir,
        'file1.json',
        2048,
        'sha256checksum',
      );

      const fileState = ledger.files['file1.json'];
      expect(fileState!.status).toBe('generated');
      expect(fileState!.size).toBe(2048);
      expect(fileState!.checksum).toBe('sha256checksum');
      expect(fileState!.generatedAt).toBeDefined();
      expect(fileState!.errorMessage).toBeUndefined();
    });

    it('should work without checksum', async () => {
      const filenames = ['file1.json'];
      await initializeLedger(testDir, filenames);

      const ledger = await markFileGenerated(testDir, 'file1.json', 1024);

      const fileState = ledger.files['file1.json'];
      expect(fileState!.status).toBe('generated');
      expect(fileState!.size).toBe(1024);
      expect(fileState!.checksum).toBeUndefined();
    });
  });

  describe('markFileReplaced', () => {
    it('should mark file as replaced with timestamp', async () => {
      const filenames = ['file1.json'];
      await initializeLedger(testDir, filenames);

      // First mark as generated
      await markFileGenerated(testDir, 'file1.json', 1024, 'checksum123');

      // Then mark as replaced
      const ledger = await markFileReplaced(testDir, 'file1.json');

      const fileState = ledger.files['file1.json'];
      expect(fileState!.status).toBe('replaced');
      expect(fileState!.replacedAt).toBeDefined();
      expect(fileState!.errorMessage).toBeUndefined();
      // Previous data should be preserved
      expect(fileState!.size).toBe(1024);
      expect(fileState!.checksum).toBe('checksum123');
    });
  });

  describe('markFileFailed', () => {
    it('should mark file as failed with error message', async () => {
      const filenames = ['file1.json'];
      await initializeLedger(testDir, filenames);

      const ledger = await markFileFailed(
        testDir,
        'file1.json',
        'Network error',
      );

      const fileState = ledger.files['file1.json'];
      expect(fileState!.status).toBe('failed');
      expect(fileState!.errorMessage).toBe('Network error');
    });
  });

  describe('getFilesNeedingGeneration', () => {
    it('should return files with pending or failed status', async () => {
      const filenames = ['file1.json', 'file2.json', 'file3.json'];
      await initializeLedger(testDir, filenames);

      // Mark one as generated
      await markFileGenerated(testDir, 'file2.json', 1024);
      // Mark one as failed
      await markFileFailed(testDir, 'file3.json', 'Error');

      const filesNeedingGeneration = await getFilesNeedingGeneration(testDir);

      expect(filesNeedingGeneration).toContain('file1.json'); // pending
      expect(filesNeedingGeneration).toContain('file3.json'); // failed
      expect(filesNeedingGeneration).not.toContain('file2.json'); // generated
    });

    it('should return empty array if all files are generated', async () => {
      const filenames = ['file1.json'];
      await initializeLedger(testDir, filenames);
      await markFileGenerated(testDir, 'file1.json', 1024);

      const filesNeedingGeneration = await getFilesNeedingGeneration(testDir);
      expect(filesNeedingGeneration).toEqual([]);
    });

    it('should return empty array if no ledger exists', async () => {
      const filesNeedingGeneration = await getFilesNeedingGeneration(testDir);
      expect(filesNeedingGeneration).toEqual([]);
    });
  });

  describe('getFilesNeedingReplacement', () => {
    it('should return files that are generated but not replaced', async () => {
      const filenames = ['file1.json', 'file2.json', 'file3.json'];
      await initializeLedger(testDir, filenames);

      // Mark two as generated
      await markFileGenerated(testDir, 'file1.json', 1024);
      await markFileGenerated(testDir, 'file2.json', 2048);
      // Mark one as replaced
      await markFileGenerated(testDir, 'file3.json', 512);
      await markFileReplaced(testDir, 'file3.json');

      const filesNeedingReplacement = await getFilesNeedingReplacement(testDir);

      expect(filesNeedingReplacement).toContain('file1.json');
      expect(filesNeedingReplacement).toContain('file2.json');
      expect(filesNeedingReplacement).not.toContain('file3.json');
    });

    it('should return empty array if all generated files are replaced', async () => {
      const filenames = ['file1.json'];
      await initializeLedger(testDir, filenames);
      await markFileGenerated(testDir, 'file1.json', 1024);
      await markFileReplaced(testDir, 'file1.json');

      const filesNeedingReplacement = await getFilesNeedingReplacement(testDir);
      expect(filesNeedingReplacement).toEqual([]);
    });
  });

  describe('isGenerationComplete', () => {
    it('should return true when all files are generated or replaced', async () => {
      const filenames = ['file1.json', 'file2.json'];
      await initializeLedger(testDir, filenames);

      await markFileGenerated(testDir, 'file1.json', 1024);
      await markFileReplaced(testDir, 'file2.json');

      const isComplete = await isGenerationComplete(testDir);
      expect(isComplete).toBe(true);
    });

    it('should return false when some files are still pending', async () => {
      const filenames = ['file1.json', 'file2.json'];
      await initializeLedger(testDir, filenames);

      await markFileGenerated(testDir, 'file1.json', 1024);
      // file2.json is still pending

      const isComplete = await isGenerationComplete(testDir);
      expect(isComplete).toBe(false);
    });

    it('should return false when some files have failed', async () => {
      const filenames = ['file1.json', 'file2.json'];
      await initializeLedger(testDir, filenames);

      await markFileGenerated(testDir, 'file1.json', 1024);
      await markFileFailed(testDir, 'file2.json', 'Error');

      const isComplete = await isGenerationComplete(testDir);
      expect(isComplete).toBe(false);
    });
  });

  describe('isReplacementComplete', () => {
    it('should return true when all files are replaced', async () => {
      const filenames = ['file1.json', 'file2.json'];
      await initializeLedger(testDir, filenames);

      await markFileGenerated(testDir, 'file1.json', 1024);
      await markFileGenerated(testDir, 'file2.json', 2048);
      await markFileReplaced(testDir, 'file1.json');
      await markFileReplaced(testDir, 'file2.json');

      const isComplete = await isReplacementComplete(testDir);
      expect(isComplete).toBe(true);
    });

    it('should return false when some files are not replaced', async () => {
      const filenames = ['file1.json', 'file2.json'];
      await initializeLedger(testDir, filenames);

      await markFileGenerated(testDir, 'file1.json', 1024);
      await markFileGenerated(testDir, 'file2.json', 2048);
      await markFileReplaced(testDir, 'file1.json');
      // file2.json is not replaced

      const isComplete = await isReplacementComplete(testDir);
      expect(isComplete).toBe(false);
    });
  });

  describe('incrementRetryCount', () => {
    it('should increment retry count', async () => {
      const filenames = ['file1.json'];
      await initializeLedger(testDir, filenames);

      let ledger = await incrementRetryCount(testDir);
      expect(ledger.retryCount).toBe(1);

      ledger = await incrementRetryCount(testDir);
      expect(ledger.retryCount).toBe(2);

      ledger = await incrementRetryCount(testDir);
      expect(ledger.retryCount).toBe(3);
    });

    it('should throw error if ledger does not exist', async () => {
      await expect(incrementRetryCount(testDir)).rejects.toThrow(
        'Ledger not found',
      );
    });
  });

  describe('cleanupLedger', () => {
    it('should delete ledger file', async () => {
      const filenames = ['file1.json'];
      await initializeLedger(testDir, filenames);

      const ledgerPath = path.join(testDir, '.generation_ledger.json');
      expect(await fs.stat(ledgerPath)).toBeDefined();

      await cleanupLedger(testDir);

      expect(await fs.stat(ledgerPath).catch(() => null)).toBeNull();
    });

    it('should not throw error if ledger file does not exist', async () => {
      await expect(cleanupLedger(testDir)).resolves.not.toThrow();
    });
  });

  describe('Ledger Persistence', () => {
    it('should persist ledger state across multiple operations', async () => {
      const filenames = ['file1.json', 'file2.json'];
      await initializeLedger(testDir, filenames);

      // Perform multiple operations
      await updatePhase(testDir, 'generation_in_progress');
      await markFileGenerated(testDir, 'file1.json', 1024, 'checksum1');
      await incrementRetryCount(testDir);
      await markFileGenerated(testDir, 'file2.json', 2048, 'checksum2');
      await markFileReplaced(testDir, 'file1.json');
      await updatePhase(testDir, 'replacement_in_progress');
      await markFileReplaced(testDir, 'file2.json');
      await updatePhase(testDir, 'completed');

      // Reload and verify
      const ledger = await loadLedger(testDir);
      expect(ledger).not.toBeNull();
      expect(ledger?.phase).toBe('completed');
      expect(ledger?.retryCount).toBe(1);
      expect(ledger?.completedAt).toBeDefined();
      const file1 = ledger?.files['file1.json'];
      const file2 = ledger?.files['file2.json'];
      expect(file1).toBeDefined();
      expect(file2).toBeDefined();
      expect(file1!.status).toBe('replaced');
      expect(file2!.status).toBe('replaced');
      expect(file1!.checksum).toBe('checksum1');
      expect(file2!.checksum).toBe('checksum2');
    });
  });
});
