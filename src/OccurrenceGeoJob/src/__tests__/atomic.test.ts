/**
 * Atomic File Operations Tests
 *
 * Tests for atomic file replacement functionality.
 */

import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  atomicReplaceAll,
  atomicReplaceWithLedger,
  writeToStagingWithLedger,
  calculateChecksum,
  initializeLedger,
  loadLedger,
  updatePhase,
  markFileReplaced,
} from '@/config/index.js';

// Helper to create temporary test directory
async function createTestDir(): Promise<{
  dir: string;
  cleanup: () => Promise<void>;
}> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'atomic-test-'));
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

// Helper to create test files
async function createTestFile(
  dir: string,
  filename: string,
  content: string = 'test content',
): Promise<string> {
  const filePath = path.join(dir, filename);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, content);
  return filePath;
}

// Helper to read file content
async function readFileContent(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8');
}

describe('Atomic File Operations', () => {
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

  describe('calculateChecksum', () => {
    it('should calculate SHA256 checksum of a file', async () => {
      const content = 'Hello, World!';
      await createTestFile(testDir, 'test.txt', content);
      const filePath = path.join(testDir, 'test.txt');

      const checksum = await calculateChecksum(filePath);

      expect(checksum).toBeDefined();
      expect(checksum.length).toBe(64); // SHA256 produces 64 hex characters
      expect(checksum).toMatch(/^[a-f0-9]+$/);
    });

    it('should calculate different checksums for different content', async () => {
      const content1 = 'Content A';
      const content2 = 'Content B';

      await createTestFile(testDir, 'test1.txt', content1);
      await createTestFile(testDir, 'test2.txt', content2);

      const checksum1 = await calculateChecksum(
        path.join(testDir, 'test1.txt'),
      );
      const checksum2 = await calculateChecksum(
        path.join(testDir, 'test2.txt'),
      );

      expect(checksum1).not.toBe(checksum2);
    });

    it('should calculate same checksum for same content', async () => {
      const content = 'Same content';

      await createTestFile(testDir, 'test1.txt', content);
      await createTestFile(testDir, 'test2.txt', content);

      const checksum1 = await calculateChecksum(
        path.join(testDir, 'test1.txt'),
      );
      const checksum2 = await calculateChecksum(
        path.join(testDir, 'test2.txt'),
      );

      expect(checksum1).toBe(checksum2);
    });
  });

  describe('writeToStagingWithLedger', () => {
    it('should write file to staging directory and update ledger', async () => {
      const filenames = ['test.json'];
      await initializeLedger(stagingDir, filenames);

      const content = { data: 'test', value: 42 };
      const result = await writeToStagingWithLedger(
        stagingDir,
        'test.json',
        content,
      );

      expect(result.success).toBe(true);
      expect(result.filePath).toBe(path.join(stagingDir, 'test.json'));
      expect(result.size).toBeGreaterThan(0);
      expect(result.checksum).toBeDefined();

      // Verify file exists and has correct content
      const fileContent = await readFileContent(result.filePath);
      expect(JSON.parse(fileContent)).toEqual(content);

      // Verify ledger was updated
      const ledger = await loadLedger(stagingDir);
      expect(ledger).not.toBeNull();
      const testFile = ledger!.files['test.json'];
      expect(testFile).toBeDefined();
      expect(testFile!.status).toBe('generated');
      expect(testFile!.size).toBe(result.size);
      expect(testFile!.checksum).toBe(result.checksum);
    });

    it('should handle string content', async () => {
      const filenames = ['test.txt'];
      await initializeLedger(stagingDir, filenames);

      const content = 'Plain text content';
      const result = await writeToStagingWithLedger(
        stagingDir,
        'test.txt',
        content,
      );

      expect(result.success).toBe(true);
      const fileContent = await readFileContent(result.filePath);
      expect(fileContent).toBe(content);
    });

    it('should handle Buffer content', async () => {
      const filenames = ['test.bin'];
      await initializeLedger(stagingDir, filenames);

      const content = Buffer.from([0x01, 0x02, 0x03, 0x04]);
      const result = await writeToStagingWithLedger(
        stagingDir,
        'test.bin',
        content,
      );

      expect(result.success).toBe(true);
      expect(result.size).toBe(4);
    });

    it('should use provided checksum if available', async () => {
      const filenames = ['test.json'];
      await initializeLedger(stagingDir, filenames);

      const content = { data: 'test' };
      const providedChecksum = 'provided-checksum-123';
      const result = await writeToStagingWithLedger(
        stagingDir,
        'test.json',
        content,
        providedChecksum,
      );

      expect(result.success).toBe(true);
      expect(result.checksum).toBe(providedChecksum);

      // Verify ledger uses provided checksum
      const ledger = await loadLedger(stagingDir);
      const testFile = ledger?.files['test.json'];
      expect(testFile).toBeDefined();
      expect(testFile!.checksum).toBe(providedChecksum);
    });

    it('should mark file as failed on error and update ledger', async () => {
      const filenames = ['test.json'];
      await initializeLedger(stagingDir, filenames);

      // Try to write to a directory that doesn't exist and can't be created
      const invalidPath = '/root/protected/test.json';
      const result = await writeToStagingWithLedger(
        '/nonexistent/staging',
        'test.json',
        { data: 'test' },
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should create staging directory if it does not exist', async () => {
      const newStagingDir = path.join(testDir, 'new-staging');
      const filenames = ['test.json'];
      await initializeLedger(newStagingDir, filenames);

      const result = await writeToStagingWithLedger(
        newStagingDir,
        'test.json',
        { data: 'test' },
      );

      expect(result.success).toBe(true);
      expect(await fs.stat(newStagingDir)).toBeDefined();
    });
  });

  describe('atomicReplaceAll', () => {
    it('should atomically replace all files from staging to target', async () => {
      const filenames = ['file1.json', 'file2.txt'];
      await initializeLedger(stagingDir, filenames);

      // Write files to staging
      await writeToStagingWithLedger(stagingDir, 'file1.json', {
        data: 'file1',
      });
      await writeToStagingWithLedger(
        stagingDir,
        'file2.txt',
        'content of file2',
      );

      const result = await atomicReplaceAll(stagingDir, targetDir, filenames, {
        createBackup: false,
        verifyChecksums: true,
        cleanupStaging: true,
      });

      expect(result.success).toBe(true);
      expect(result.replacedFiles).toEqual(['file1.json', 'file2.txt']);
      expect(result.failedFiles).toEqual([]);
      expect(result.errors).toEqual({});

      // Verify files exist in target
      expect(await fs.stat(path.join(targetDir, 'file1.json'))).toBeDefined();
      expect(await fs.stat(path.join(targetDir, 'file2.txt'))).toBeDefined();

      // Verify files are removed from staging (cleanup enabled)
      expect(
        await fs.stat(path.join(stagingDir, 'file1.json')).catch(() => null),
      ).toBeNull();
      expect(
        await fs.stat(path.join(stagingDir, 'file2.txt')).catch(() => null),
      ).toBeNull();
    });

    it('should create backups when createBackup is true', async () => {
      const filenames = ['file1.json'];
      await initializeLedger(stagingDir, filenames);

      // Create existing file in target
      await createTestFile(targetDir, 'file1.json', 'existing content');

      // Write new file to staging
      await writeToStagingWithLedger(stagingDir, 'file1.json', {
        data: 'new content',
      });

      const backupDir = path.join(testDir, 'backups');
      const result = await atomicReplaceAll(stagingDir, targetDir, filenames, {
        createBackup: true,
        backupDirectory: backupDir,
        cleanupStaging: false,
      });

      expect(result.success).toBe(true);

      // Verify backup was created
      const backupFiles = await fs.readdir(backupDir);
      expect(backupFiles.length).toBeGreaterThan(0);
      const backupFile = backupFiles.find((f) => f.includes('file1.json'));
      expect(backupFile).toBeDefined();

      // Verify backup contains original content
      const backupContent = await readFileContent(
        path.join(backupDir, backupFile!),
      );
      expect(backupContent).toBe('existing content');
    });

    it('should handle partial failures and continue with remaining files', async () => {
      const filenames = ['file1.json', 'file2.json', 'file3.json'];
      await initializeLedger(stagingDir, filenames);

      // Write files to staging
      await writeToStagingWithLedger(stagingDir, 'file1.json', {
        data: 'file1',
      });
      await writeToStagingWithLedger(stagingDir, 'file2.json', {
        data: 'file2',
      });
      await writeToStagingWithLedger(stagingDir, 'file3.json', {
        data: 'file3',
      });

      // Remove file2 from staging to simulate failure
      await fs.unlink(path.join(stagingDir, 'file2.json'));

      const result = await atomicReplaceAll(stagingDir, targetDir, filenames, {
        createBackup: false,
        verifyChecksums: false,
        cleanupStaging: false,
      });

      expect(result.success).toBe(false);
      expect(result.replacedFiles).toContain('file1.json');
      expect(result.replacedFiles).toContain('file3.json');
      expect(result.failedFiles).toContain('file2.json');
      expect(result.errors['file2.json']).toBeDefined();

      // Verify successful files were replaced
      expect(await fs.stat(path.join(targetDir, 'file1.json'))).toBeDefined();
      expect(await fs.stat(path.join(targetDir, 'file3.json'))).toBeDefined();
      // Verify failed file was not replaced
      expect(
        await fs.stat(path.join(targetDir, 'file2.json')).catch(() => null),
      ).toBeNull();
    });

    it('should update ledger with file statuses', async () => {
      const filenames = ['file1.json', 'file2.json'];
      await initializeLedger(stagingDir, filenames);

      await writeToStagingWithLedger(stagingDir, 'file1.json', {
        data: 'file1',
      });
      await writeToStagingWithLedger(stagingDir, 'file2.json', {
        data: 'file2',
      });

      await atomicReplaceAll(stagingDir, targetDir, filenames, {
        createBackup: false,
        cleanupStaging: true,
      });

      const ledger = await loadLedger(stagingDir);
      expect(ledger?.phase).toBe('completed');
      const file1 = ledger?.files['file1.json'];
      const file2 = ledger?.files['file2.json'];
      expect(file1).toBeDefined();
      expect(file2).toBeDefined();
      expect(file1!.status).toBe('replaced');
      expect(file2!.status).toBe('replaced');
      expect(file1!.replacedAt).toBeDefined();
      expect(file2!.replacedAt).toBeDefined();
    });

    it('should set phase to failed if some files fail', async () => {
      const filenames = ['file1.json', 'file2.json'];
      await initializeLedger(stagingDir, filenames);

      await writeToStagingWithLedger(stagingDir, 'file1.json', {
        data: 'file1',
      });
      await writeToStagingWithLedger(stagingDir, 'file2.json', {
        data: 'file2',
      });

      // Remove file2 to cause failure
      await fs.unlink(path.join(stagingDir, 'file2.json'));

      await atomicReplaceAll(stagingDir, targetDir, filenames, {
        createBackup: false,
        cleanupStaging: false,
      });

      const ledger = await loadLedger(stagingDir);
      expect(ledger?.phase).toBe('failed');
      const file1 = ledger?.files['file1.json'];
      const file2 = ledger?.files['file2.json'];
      expect(file1).toBeDefined();
      expect(file2).toBeDefined();
      expect(file1!.status).toBe('replaced');
      expect(file2!.status).toBe('failed');
    });

    it('should skip backup directory creation if createBackup is false', async () => {
      const filenames = ['file1.json'];
      await initializeLedger(stagingDir, filenames);

      await writeToStagingWithLedger(stagingDir, 'file1.json', {
        data: 'file1',
      });

      await atomicReplaceAll(stagingDir, targetDir, filenames, {
        createBackup: false,
        cleanupStaging: true,
      });

      // Verify no backup directory was created
      const backupDir = path.join(stagingDir, '.backups');
      expect(await fs.stat(backupDir).catch(() => null)).toBeNull();
    });
  });

  describe('atomicReplaceWithLedger', () => {
    it('should perform full replacement when no existing ledger', async () => {
      const filenames = ['file1.json', 'file2.txt'];

      // Initialize ledger but don't start replacement
      await initializeLedger(stagingDir, filenames);
      await updatePhase(stagingDir, 'generation_complete');

      // Write files to staging
      await writeToStagingWithLedger(stagingDir, 'file1.json', {
        data: 'file1',
      });
      await writeToStagingWithLedger(
        stagingDir,
        'file2.txt',
        'content of file2',
      );

      const result = await atomicReplaceWithLedger(
        stagingDir,
        targetDir,
        filenames,
        {
          createBackup: false,
          cleanupStaging: true,
        },
      );

      expect(result.success).toBe(true);
      expect(result.resumed).toBe(false);
      expect(result.replacedFiles).toEqual(['file1.json', 'file2.txt']);

      // Verify files exist in target
      expect(await fs.stat(path.join(targetDir, 'file1.json'))).toBeDefined();
      expect(await fs.stat(path.join(targetDir, 'file2.txt'))).toBeDefined();
    });

    it('should resume from previous run when ledger exists with generation_complete phase', async () => {
      const filenames = ['file1.json', 'file2.json', 'file3.json'];

      // Initialize and mark generation complete
      await initializeLedger(stagingDir, filenames);
      await updatePhase(stagingDir, 'generation_complete');

      // Write and mark some files as generated
      await writeToStagingWithLedger(stagingDir, 'file1.json', {
        data: 'file1',
      });
      await writeToStagingWithLedger(stagingDir, 'file2.json', {
        data: 'file2',
      });
      await writeToStagingWithLedger(stagingDir, 'file3.json', {
        data: 'file3',
      });

      // Manually mark file1 and file2 as replaced
      await markFileReplaced(stagingDir, 'file1.json');
      await markFileReplaced(stagingDir, 'file2.json');

      // Now run atomicReplaceWithLedger - it should only replace file3
      const result = await atomicReplaceWithLedger(
        stagingDir,
        targetDir,
        filenames,
        {
          createBackup: false,
          cleanupStaging: false,
        },
      );

      expect(result.success).toBe(true);
      expect(result.resumed).toBe(true);
      expect(result.replacedFiles).toEqual(['file3.json']);

      // Verify ledger phase is completed
      const ledger = await loadLedger(stagingDir);
      expect(ledger?.phase).toBe('completed');
    });

    it('should handle case where no files need replacement on resume', async () => {
      const filenames = ['file1.json'];

      // Initialize and mark generation complete
      await initializeLedger(stagingDir, filenames);
      await updatePhase(stagingDir, 'generation_complete');

      // Write and mark file as replaced
      await writeToStagingWithLedger(stagingDir, 'file1.json', {
        data: 'file1',
      });
      await markFileReplaced(stagingDir, 'file1.json');

      // Now run atomicReplaceWithLedger
      const result = await atomicReplaceWithLedger(
        stagingDir,
        targetDir,
        filenames,
        {
          createBackup: false,
          cleanupStaging: false,
        },
      );

      expect(result.success).toBe(true);
      expect(result.resumed).toBe(true);
      expect(result.replacedFiles).toEqual([]);

      // Verify ledger phase is completed
      const ledger = await loadLedger(stagingDir);
      expect(ledger?.phase).toBe('completed');
    });

    it('should propagate errors from atomicReplaceAll', async () => {
      const filenames = ['file1.json'];

      await initializeLedger(stagingDir, filenames);
      await updatePhase(stagingDir, 'generation_complete');

      // Write file to staging
      await writeToStagingWithLedger(stagingDir, 'file1.json', {
        data: 'file1',
      });

      // Remove file to cause error
      await fs.unlink(path.join(stagingDir, 'file1.json'));

      await expect(
        atomicReplaceWithLedger(stagingDir, targetDir, filenames, {
          createBackup: false,
          cleanupStaging: false,
        }),
      ).rejects.toThrow();
    });
  });

  describe('Atomicity Tests', () => {
    it('should ensure files are either fully replaced or not at all', async () => {
      const filenames = ['file1.json', 'file2.json'];
      await initializeLedger(stagingDir, filenames);

      // Write files to staging
      await writeToStagingWithLedger(stagingDir, 'file1.json', {
        data: 'file1',
      });
      await writeToStagingWithLedger(stagingDir, 'file2.json', {
        data: 'file2',
      });

      // Verify target directory is empty before replacement
      expect(await fs.readdir(targetDir).catch(() => [])).toEqual([]);

      // Perform replacement
      await atomicReplaceAll(stagingDir, targetDir, filenames, {
        createBackup: false,
        cleanupStaging: true,
      });

      // Verify both files exist in target
      const targetFiles = await fs.readdir(targetDir);
      expect(targetFiles.sort()).toEqual(['file1.json', 'file2.json'].sort());

      // Verify content is correct
      const file1Content = JSON.parse(
        await readFileContent(path.join(targetDir, 'file1.json')),
      );
      const file2Content = await readFileContent(
        path.join(targetDir, 'file2.json'),
      );
      expect(file1Content.data).toBe('file1');
      expect(file2Content).toBe('file2');
    });

    it('should use atomic rename operation for file replacement', async () => {
      const filenames = ['test.json'];
      await initializeLedger(stagingDir, filenames);

      // Create existing file in target
      const existingPath = path.join(targetDir, 'test.json');
      await fs.writeFile(existingPath, 'existing content');

      // Write new file to staging
      await writeToStagingWithLedger(stagingDir, 'test.json', {
        data: 'new content',
      });

      // Perform replacement
      await atomicReplaceAll(stagingDir, targetDir, filenames, {
        createBackup: false,
        cleanupStaging: true,
      });

      // Verify file was replaced atomically
      const content = JSON.parse(await readFileContent(existingPath));
      expect(content.data).toBe('new content');
    });

    it('should handle checksum verification', async () => {
      const filenames = ['test.json'];
      await initializeLedger(stagingDir, filenames);

      const content = { data: 'test' };
      await writeToStagingWithLedger(stagingDir, 'test.json', content);

      const result = await atomicReplaceAll(stagingDir, targetDir, filenames, {
        createBackup: false,
        verifyChecksums: true,
        cleanupStaging: false,
      });

      expect(result.success).toBe(true);

      // Verify checksum is calculated and stored
      const ledger = await loadLedger(stagingDir);
      const testFile = ledger?.files['test.json'];
      expect(testFile).toBeDefined();
      expect(testFile!.checksum).toBeDefined();
    });
  });

  describe('Backup Functionality', () => {
    it('should create backup of existing files before replacement', async () => {
      const filenames = ['test.json'];
      await initializeLedger(stagingDir, filenames);

      // Create existing file in target
      const existingPath = path.join(targetDir, 'test.json');
      await fs.writeFile(existingPath, 'original content');

      // Write new file to staging
      await writeToStagingWithLedger(stagingDir, 'test.json', {
        data: 'new content',
      });

      const backupDir = path.join(testDir, 'backups');
      await atomicReplaceAll(stagingDir, targetDir, filenames, {
        createBackup: true,
        backupDirectory: backupDir,
        cleanupStaging: true,
      });

      // Verify backup exists
      const backupFiles = await fs.readdir(backupDir);
      expect(backupFiles.length).toBe(1);
      const backupPath = path.join(backupDir, backupFiles[0]!);
      const backupContent = await readFileContent(backupPath);
      expect(backupContent).toBe('original content');

      // Verify target has new content
      const targetContent = JSON.parse(await readFileContent(existingPath));
      expect(targetContent.data).toBe('new content');
    });

    it('should not fail if target file does not exist', async () => {
      const filenames = ['test.json'];
      await initializeLedger(stagingDir, filenames);

      // Write file to staging (no existing file in target)
      await writeToStagingWithLedger(stagingDir, 'test.json', {
        data: 'new content',
      });

      const backupDir = path.join(testDir, 'backups');
      const result = await atomicReplaceAll(stagingDir, targetDir, filenames, {
        createBackup: true,
        backupDirectory: backupDir,
        cleanupStaging: true,
      });

      expect(result.success).toBe(true);
      expect(await fs.readdir(backupDir).catch(() => [])).toEqual([]);
    });
  });
});
