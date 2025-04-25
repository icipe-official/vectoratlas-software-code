import { BlobServiceClient } from '@azure/storage-blob';
import * as fs from 'fs';
import config from '../../config/config';
import { ensureDirectoryExists } from 'src/utils';

const BLOB_FOLDER = config.get('modelOutputBlobFolder');
const CONTAINER_NAME = config.get('blobContainer');

export const downloadModelOutput = async (modelOutputName, blobLocation) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    config.get('blobStorageConnectionString'),
  );
  const containerName = getContainerName();
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blobClient = containerClient.getBlockBlobClient(blobLocation);
  ensureDirectoryExists(`${BLOB_FOLDER}`);
  await blobClient.downloadToFile(`${BLOB_FOLDER}${modelOutputName}.tif`);
};

const getContainerName = () => {
  const suffix = process.env.NODE_ENV
    ? process.env.NODE_ENV.toString().toLowerCase() === 'production'
      ? ''
      : '-' + process.env.NODE_ENV.toString().toLowerCase()
    : '-test';
  return `${CONTAINER_NAME}${suffix}`;
};

export const cleanupDownloadedBlob = (modelOutputName) => {
  fs.unlinkSync(`${BLOB_FOLDER}${modelOutputName}.tif`);
};
