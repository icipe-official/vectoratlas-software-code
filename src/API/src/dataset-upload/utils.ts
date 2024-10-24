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
