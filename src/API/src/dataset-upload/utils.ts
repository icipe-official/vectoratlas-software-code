import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import * as fs from 'fs';
import config from 'src/config/config';
import { v4 as uuidv4 } from 'uuid';

const BLOB_FOLDER = config.get('datasetBlobFolder');
const CONTAINER_NAME = 'vectoratlas-container';

/**
 * Download dataset
 * @param datasetName
 * @param blobLocation
 */
export const downloadDataset = async (datasetName: string) => {
  const blobClient = getBlobClient(datasetName);
  await blobClient.downloadToFile(makeFileName(datasetName));
};

/**
 * Upload dataset and prefix its name with uuid to ensure existing one is not replaced
 */
export const uploadDataset = async (file: Express.Multer.File) => {
  const blobClient = getBlobClient(uuidv4() + file.originalname);
  return await blobClient.uploadData(file.buffer);
};

/**
 * Delete file if exists
 * @param datasetName
 */
export const deleteDataset = async (datasetName: string) => {
  const blobClient = getBlobClient(datasetName);
  await blobClient.deleteIfExists();
};

export const cleanUpDownloadedBlob = (datasetName) => {
  fs.unlinkSync(makeFileName(datasetName));
};

/**
 * Make file name
 * @param datasetName
 * @returns
 */
const makeFileName = (datasetName) => {
  return `${BLOB_FOLDER}${datasetName}.csv`;
};

const getBlobClient = (datasetName: string): BlockBlobClient => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    config.get('blobStorageConnectionString'),
  );

  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

  const blobClient = containerClient.getBlockBlobClient(datasetName);
  return blobClient;
};

export const sanitize = (input, replacement = '_') => {
  const illegalRe = /[\/\?<>\\:\*\|":]/g;
  const controlRe = /[\x00-\x1f\x80-\x9f]/g;
  const reservedRe = /^\.+$/;
  const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
  const spaceRe = / /g;
  const sanitized = input
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(spaceRe, replacement);

  // return truncate(sanitized, 255);
  return sanitized;
};

const truncate = (sanitized: string, length: number): string => {
  const uint8Array = new TextEncoder().encode(sanitized);
  const truncated = uint8Array.slice(0, length);
  return new TextDecoder().decode(truncated);
};
