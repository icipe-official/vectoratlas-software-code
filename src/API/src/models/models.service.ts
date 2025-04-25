import {
  BlobServiceClient,
  BlobUploadCommonResponse,
} from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import config from 'src/config/config';
import { AzureBlobService } from 'src/db/azure-blob/azure-blob.service';
import { UploadedModelService } from 'src/db/uploaded-model/uploaded-model.service';

const MODELS_CONTAINER = 'models';
const CONTAINER_NAME = config.get('blobContainer');

@Injectable()
export class ModelsService {
  constructor(private azureBlobService: AzureBlobService) {}

  async uploadModelFileToBlob(
    modelFile: Express.Multer.File,
    blobPath: string,
  ): Promise<BlobUploadCommonResponse> {
    const { response, uploadedFileUrl } = await this.azureBlobService.upload(
      modelFile,
      MODELS_CONTAINER,
    );
    return response;
    /*
    await this.createContainer(CONTAINER_NAME);
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
    );
    const containerClient = blobServiceClient.getContainerClient(
      CONTAINER_NAME,
    );

    const blobClient = containerClient.getBlockBlobClient(blobPath);
    return await blobClient.uploadData(modelFile.buffer);*/
  }

  async downloadModelFile(blobPath: string): Promise<NodeJS.ReadableStream> {
    return await this.azureBlobService.getFile(blobPath, MODELS_CONTAINER);
    /*
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING,
    );
    const containerClient = blobServiceClient.getContainerClient(
      CONTAINER_NAME,
    );
    const blobClient = containerClient.getBlockBlobClient(blobPath);
    const blobDownloaded = await blobClient.download();
    return blobDownloaded.readableStreamBody;*/
  }

  async update(id: string, userId: string) {}
}
