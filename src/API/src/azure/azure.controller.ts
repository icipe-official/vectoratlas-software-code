import { BlobServiceClient } from '@azure/storage-blob';
import { Controller, Get } from '@nestjs/common';

@Controller('azure')
export class AzureController {
  @Get('list')
  async getList() {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    let i = 1;
    for await (const container of blobServiceClient.listContainers()) {
      console.log(`Container ${i++}: ${container.name}`);
    }
    const containerCLient = blobServiceClient.getContainerClient('vectoratlas-container')
    let j = 1;
    for await (const blob of containerCLient.listBlobsFlat()) {
      console.log(`Blob ${j++}: ${blob.name}`);
    }
  }
}
