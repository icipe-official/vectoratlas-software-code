import {
  BlobServiceClient,
  BlobUploadCommonResponse,
} from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ModelsService {
  async uploadModelFileToBlob(
    modelFile: Express.Multer.File,
    blobPath: string,
  ): Promise<BlobUploadCommonResponse> {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
    );
    const containerClient = blobServiceClient.getContainerClient(
      'vectoratlas-container',
    );

    const blobClient = containerClient.getBlockBlobClient(blobPath);
    return await blobClient.uploadData(modelFile.buffer);
  }

  async downloadModelFile(blobPath: string): Promise<NodeJS.ReadableStream> {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
    );
    const containerClient = blobServiceClient.getContainerClient(
      'vectoratlas-container',
    );
    const blobClient = containerClient.getBlockBlobClient(blobPath);
    const blobDownloaded = await blobClient.download();
    return blobDownloaded.readableStreamBody;
  }
}
