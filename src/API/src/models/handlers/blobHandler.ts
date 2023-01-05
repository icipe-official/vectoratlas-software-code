import { BlobServiceClient } from '@azure/storage-blob';
import * as fs from 'fs';
import config from '../../config/config';

const BLOB_FOLDER = config.get('modelOutputBlobFolder');

export const downloadModelOutput = async (modelOutputName, blobLocation) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    config.get('blobStorageConnectionString'),
  );
  const containerClient = blobServiceClient.getContainerClient(
    'vectoratlas-container',
  );

  const blobClient = containerClient.getBlockBlobClient(blobLocation);

  await blobClient.downloadToFile(`${BLOB_FOLDER}${modelOutputName}.tif`);
};

export const cleanupDownloadedBlob = (modelOutputName) => {
  fs.unlinkSync(`${BLOB_FOLDER}${modelOutputName}.tif`);
};
