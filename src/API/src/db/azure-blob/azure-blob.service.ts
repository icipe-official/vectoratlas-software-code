import {
  BlobDownloadResponseParsed,
  BlobServiceClient,
  BlockBlobClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { HttpCode, Inject, Injectable } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import config from 'src/config/config';
import { formatDate, makeFileNameTimestamped } from 'src/utils';
import { v4 as uuidv4 } from 'uuid';

const BLOB_FOLDER = config.get('datasetBlobFolder');

// @TODO create interface to view blobs https://medium.com/@divanshSachdeva/securely-stream-files-to-azure-blob-storage-with-node-js-and-aes-256-ctr-encryption-e896426dc80c
@Injectable()
export class AzureBlobService {
  containerName: string;
  azureConnection = config.get('blobStorageConnectionString');

  createConnectionClient = () => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      config.get('blobStorageConnectionString'),
    );
    return blobServiceClient;
  };

  getBlobClient = (datasetName: string): BlockBlobClient => {
    const blobServiceClient = this.createConnectionClient();
    const containerClient = blobServiceClient.getContainerClient(
      this.containerName,
    );
    const blobClient = containerClient.getBlockBlobClient(datasetName);
    return blobClient;
  };

  /**
   * Creates a container if it does not exist
   * @param containerName
   * @returns
   */
  async createContainer(containerName: string): Promise<boolean> {
    // Create a container
    const containerClient =
      this.createConnectionClient().getContainerClient(containerName);
    if (await containerClient.exists()) {
      return true;
    }
    try {
      const createContainerResponse = await containerClient.createIfNotExists(); //.create();
      console.log(
        `Create container ${containerName} successfully`,
        createContainerResponse.requestId,
      );
      return createContainerResponse._response.status == HttpStatusCode.Created;
    } catch (error) {
      console.log('Error: ', error);
    }
    return false;
  }

  // async listContainers() {
  //   const account = '<account>';
  //   // const defaultAzureCredential = new DefaultAzureCredential();

  //   const blobServiceClient = new BlobServiceClient(
  //     `https://${account}.blob.core.windows.net`,
  //     defaultAzureCredential,
  //   );
  //   let i = 1;
  //   const containers = blobServiceClient.listContainers();
  //   for await (const container of containers) {
  //     console.log(`Container ${i++}: ${container.name}`);
  //   }
  // }

  async upload(
    file: Express.Multer.File,
    containerName: string,
  ): Promise<string> {
    try {
      this.containerName = containerName;
      await this.createContainer(containerName);
      // const fileParts = file.originalname.split('.');
      // const extension = fileParts.pop();
      // const fileUrl = /*uuidv4() +*/ `${fileParts.join('')}-${formatDate(
      //   new Date(),
      // )}.${extension}`;
      const fileUrl = makeFileNameTimestamped(file.originalname);
      const blobClient = this.getBlobClient(fileUrl);
      const res = await blobClient.uploadData(file.buffer); // upload file data
      // console.log('Upload res', blobClient.url, res);
      // return fileUrl; // return url of uploaded file
      return blobClient.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Download file from blob storage
   * @param blobName
   * @param destinationFileName/ File name without path
   * @returns
   */
  download = async (
    blobName: string,
    containerName: string,
    destinationFileName: string,
  ): Promise<BlobDownloadResponseParsed> => {
    this.containerName = containerName;
    const blobClient = this.getBlobClient(blobName);
    return await blobClient.downloadToFile(destinationFileName);
  };

  /**
   * Read file from Blob Storage
   * @param fileName
   * @param containerName
   * @returns
   */
  getFile = async (fileName: string, containerName: string) => {
    this.containerName = containerName;
    const blobClient = this.getBlobClient(fileName);
    const blobDownloaded = await blobClient.download(); // download file from blob
    return blobDownloaded.readableStreamBody; // Return readable stream of file data
  };

  /**
   * Delete file if exists
   * @param datasetName
   */
  deleteFile = async (fileName: string, containerName: string) => {
    this.containerName = containerName;
    const blobClient = this.getBlobClient(fileName);
    await blobClient.deleteIfExists();
  };

  /**
   * Make file name
   * @param datasetName
   * @returns
   */
  makeFileName = (datasetName) => {
    return `${BLOB_FOLDER}${datasetName}.csv`;
  };
}
