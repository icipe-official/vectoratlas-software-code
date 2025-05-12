import {
  BlobDownloadResponseParsed,
  BlobServiceClient,
  BlobUploadCommonResponse,
  BlockBlobClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { HttpCode, Inject, Injectable } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import config from 'src/config/config';
import { formatDate, makeFileNameTimestamped } from 'src/utils';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { extractFileNameFromBlobUrl } from 'src/utils';

const BLOB_FOLDER = config.get('datasetBlobFolder');
const CONTAINER_NAME = config.get('blobContainer');

export interface AzureBlobUploadResponse {
  container: string;
  response: BlobUploadCommonResponse;
  filePath: string;
  uploadedFileUrl: string;
}

// @TODO create interface to view blobs https://medium.com/@divanshSachdeva/securely-stream-files-to-azure-blob-storage-with-node-js-and-aes-256-ctr-encryption-e896426dc80c
@Injectable()
export class AzureBlobService {
  containerName: string;
  azureConnection = config.get('blobStorageConnectionString');

  createConnectionClient = () => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      config.get('blobStorageConnectionString'),
    );
    console.log(
      'Connection string: ',
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

  async listContainers() {
    /*const account = '<account>';
    // const defaultAzureCredential = new DefaultAzureCredential();
   
    const blobServiceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net`,
      defaultAzureCredential,
    );
    let i = 1;
    const containers = blobServiceClient.listContainers();
    for await (const container of containers) {
      console.log(`Container ${i++}: ${container.name}`);
    }
    */
    const blobServiceClient = this.createConnectionClient();
    let i = 1;
    const containers = blobServiceClient.listContainers();
    for await (const container of containers) {
      console.log(`Container ${i++}: ${container.name}`);
      if (
        ['raw', 'primary-reviewed', 'tertiary-reviewed'].includes(
          container.name,
        )
      ) {
        await blobServiceClient.deleteContainer(container.name);
      }
    }
  }

  async upload(
    file: Express.Multer.File,
    directory: string,
  ): Promise<AzureBlobUploadResponse> {
    try {
      await this.listContainers();
      this.containerName = this.getContainerName();
      await this.createContainer(this.containerName);
      const fileUrl = makeFileNameTimestamped(file.originalname, directory);
      const blobClient = await this.getBlobClient(fileUrl);
      const res = await blobClient.uploadData(file.buffer); // upload file data
      // return fileUrl; // return url of uploaded file
      const result: AzureBlobUploadResponse = {
        response: res,
        uploadedFileUrl: blobClient.url,
        container: this.containerName,
        filePath: fileUrl,
      };
      console.log('Uploaded file: ', result);
      return result;
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
  downloadToLocalFile = async (
    blobName: string,
    // containerName: string,
    directory: string,
    destinationFileName: string,
  ): Promise<BlobDownloadResponseParsed> => {
    const path = `${directory}/${blobName}`;
    this.containerName = this.getContainerName(); //containerName
    console.log(
      `DownloadingToLocalFile from container ${this.containerName}. File: ${path}`,
    );
    const blobClient = this.getBlobClient(
      `${directory}/${blobName}` /*blobName*/,
    );
    return await blobClient.downloadToFile(destinationFileName);
  };

  download = async (
    blobName: string,
    // containerName: string,
    destinationFileName: string,
  ): Promise<Readable> => {
    //Promise<any> => {
    //} Promise<BlobDownloadResponseParsed> => {
    this.containerName = this.getContainerName();
    console.log('Blob Name: ', blobName);
    const fileName = extractFileNameFromBlobUrl(blobName, true);
    const blobClient = this.getBlobClient(fileName); //fileName);
    console.log(
      `Download from container ${this.containerName}. File: ${blobName}`,
    );
    // return await blobClient.downloadToFile(destinationFileName);
    const stream = await blobClient.download(); //.downloadToBuffer().OpenReadAsync();
    // return File(stream, 'application/octet-stream', 'test.csv');
    //return stream.readableStreamBody;
    return Readable.from(stream.readableStreamBody);
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

  getContainerName = () => {
    const suffix = process.env.NODE_ENV
      ? process.env.NODE_ENV.toString().toLowerCase() === 'production'
        ? ''
        : '-' + process.env.NODE_ENV.toString().toLowerCase()
      : '-test';
    return `${CONTAINER_NAME}${suffix}`;
  };
}
