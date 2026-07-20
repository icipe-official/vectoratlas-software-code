/**
 * Compression Module
 *
 * Provides functionality to compress files into various formats
 * supported by modern browsers (gzip, Brotli, Zstandard).
 *
 * Compressed files retain the original name with the compression extension added.
 * For example: data.geojson -> data.geojson.gz, data.geojson.br, data.geojson.zst
 */

import { promises as fs } from 'fs';
import path from 'path';
import { createGzip, createBrotliCompress } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import { logger } from '@/utils/index.js';

// Type for supported compression formats
export type CompressionFormat = 'gz' | 'br';

// Type for compression result
export interface CompressionResult {
  originalFile: string;
  compressedFile: string;
  originalSize: number;
  compressedSize: number;
  ratio: number;
  format: CompressionFormat;
}

/**
 * Options for compressFile function
 */
export interface CompressOptions {
  outputDir?: string | undefined;
  overwrite?: boolean | undefined;
}

/**
 * Default compression formats supported by all modern browsers
 */
export const DEFAULT_FORMATS: CompressionFormat[] = ['gz', 'br'];

/**
 * Compress a single file into the specified format
 * @param filePath - Path to the file to compress (absolute or relative)
 * @param format - Compression format ('gz', 'br', or 'zst')
 * @param options - Compression options (outputDir, overwrite)
 * @returns Promise<CompressionResult> with compression details
 */
export async function compressFile(
  filePath: string,
  format: CompressionFormat,
  options?: CompressOptions,
): Promise<CompressionResult> {
  const { outputDir, overwrite = false } = options ?? {};

  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  const dirName = path.dirname(absolutePath);
  const outputDirPath = outputDir
    ? path.isAbsolute(outputDir)
      ? outputDir
      : path.join(process.cwd(), outputDir)
    : dirName;

  const compressedFileName = `${absolutePath}.${format}`;
  const compressedFilePath = outputDir
    ? path.join(outputDirPath, path.basename(compressedFileName))
    : compressedFileName;

  // Check if compressed file already exists
  try {
    const stats = await fs.stat(compressedFilePath);
    if (!overwrite) {
      logger.info(`Skipping ${compressedFilePath} - already exists`);
      const originalStats = await fs.stat(absolutePath);
      return {
        originalFile: absolutePath,
        compressedFile: compressedFilePath,
        originalSize: originalStats.size,
        compressedSize: stats.size,
        ratio: originalStats.size / stats.size,
        format,
      };
    }
  } catch {
    // File doesn't exist, proceed with compression
  }

  // Ensure output directory exists
  await fs.mkdir(outputDirPath, { recursive: true });

  // Get original file stats
  const originalStats = await fs.stat(absolutePath);
  const originalSize = originalStats.size;

  logger.info(
    `Compressing ${absolutePath} to ${compressedFilePath} (${format})`,
  );

  // Create compression stream based on format
  const { createReadStream, createWriteStream } = await import('node:fs');

  let compressStream: any;
  if (format === 'gz') {
    compressStream = createGzip();
  } else if (format === 'br') {
    compressStream = createBrotliCompress();
  } else {
    throw new Error(
      `Unsupported compression format: ${format}. Supported formats: gz, br`,
    );
  }

  const readStream = createReadStream(absolutePath);
  const writeStream = createWriteStream(compressedFilePath);

  await pipeline(readStream, compressStream, writeStream);

  // Get compressed file size
  const compressedStats = await fs.stat(compressedFilePath);
  const compressedSize = compressedStats.size;
  const ratio = originalSize / compressedSize;

  logger.info(
    `Compressed ${absolutePath}: ${format} - ${originalSize} -> ${compressedSize} bytes (ratio: ${ratio.toFixed(2)}x)`,
  );

  return {
    originalFile: absolutePath,
    compressedFile: compressedFilePath,
    originalSize,
    compressedSize,
    ratio,
    format,
  };
}

/**
 * Compress a file into multiple formats
 * @param filePath - Path to the file to compress
 * @param formats - Array of compression formats to apply
 * @param options - Compression options
 * @returns Promise<CompressionResult[]> with all compression results
 */
export async function compressFileToFormats(
  filePath: string,
  formats: CompressionFormat[] = DEFAULT_FORMATS,
  options?: CompressOptions,
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = [];

  for (const format of formats) {
    try {
      const result = await compressFile(filePath, format, options);
      results.push(result);
    } catch (error) {
      logger.error(`Failed to compress ${filePath} to ${format}: ${error}`);
      throw error;
    }
  }

  return results;
}

/**
 * Utility function to get compressed file path
 * @param originalPath - Original file path
 * @param format - Compression format
 * @returns Compressed file path
 */
export function getCompressedFilePath(
  originalPath: string,
  format: CompressionFormat,
): string {
  return `${originalPath}.${format}`;
}

/**
 * Check if a file is compressed based on its extension
 * @param filePath - File path to check
 * @returns true if file is compressed
 */
export function isCompressedFile(filePath: string): boolean {
  const ext = path.extname(filePath);
  return ['.gz', '.br'].includes(ext);
}

/**
 * Get the original file path from a compressed file path
 * @param compressedPath - Compressed file path
 * @returns Original file path or null if not a compressed file
 */
export function getOriginalFilePath(compressedPath: string): string | null {
  const ext = path.extname(compressedPath);
  if (!isCompressedFile(compressedPath)) {
    return null;
  }
  return compressedPath.slice(0, -ext.length);
}

export default {
  compressFile,
  compressFileToFormats,
  getCompressedFilePath,
  isCompressedFile,
  getOriginalFilePath,
  DEFAULT_FORMATS,
};
