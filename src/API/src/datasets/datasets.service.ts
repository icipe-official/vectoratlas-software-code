import {
    BlobServiceClient,
    BlobUploadCommonResponse,
  } from '@azure/storage-blob';
  import { Injectable } from '@nestjs/common';
  
  @Injectable()
  export class DatasetsService {
    private readonly containerName = 'vectoratlas-container';
    private readonly datasetFolder = 'datasets/'; // Folder for datasets
  
    private getBlobServiceClient(): BlobServiceClient {
      return BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING,
      );
    }
  
    private getBlobClient(fileName: string) {
      const blobServiceClient = this.getBlobServiceClient();
      const containerClient = blobServiceClient.getContainerClient(this.containerName);
      return containerClient.getBlockBlobClient(`${this.datasetFolder}${fileName}`);
    }
  
    // Uploads CSV/XLSX file to the datasets folder
    async uploadDatasetFile(
      datasetFile: Express.Multer.File,
    ): Promise<BlobUploadCommonResponse> {
      const blobClient = this.getBlobClient(datasetFile.originalname);
      return await blobClient.uploadData(datasetFile.buffer);
    }
  
    // Downloads a dataset file from the datasets folder
    async downloadDatasetFile(fileName: string): Promise<NodeJS.ReadableStream> {
      const blobClient = this.getBlobClient(fileName);
      const blobDownloaded = await blobClient.download();
      return blobDownloaded.readableStreamBody;
    }
  }
  