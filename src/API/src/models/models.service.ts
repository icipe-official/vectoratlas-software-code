import { BlobServiceClient, BlobUploadCommonResponse } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ModelsService {
  async uploadModelFileToBlob(modelFile: Express.Multer.File): Promise<BlobUploadCommonResponse> {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient('vectoratlas-container');

    const filepath = `models//${modelFile.originalname.replace(
      /\.[^/.]+$/,
      '',
    )}`;
    const filename = `${new Date().getTime()}_${modelFile.originalname}`;

    const blobClient = containerClient.getBlockBlobClient(`${filepath}/${filename}`);
    return await blobClient.uploadData(modelFile.buffer);
  }
}
