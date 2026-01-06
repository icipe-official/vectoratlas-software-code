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
import * as JSZip from 'jszip';
import * as fs from 'fs';

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
      return createContainerResponse._response.status == HttpStatusCode.Created;
    } catch (error) {
      console.log('Error: ', error);
    }
    return false;
  }

  async listContainers() {
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

  // async upload(
  //   file: Express.Multer.File,
  //   directory: string,
  // ): Promise<AzureBlobUploadResponse> {
  //   try {
  //     await this.listContainers();
  //     this.containerName = this.getContainerName();
  //     await this.createContainer(this.containerName);
  //     const fileUrl = makeFileNameTimestamped(file.originalname, directory);
  //     const blobClient = await this.getBlobClient(fileUrl);
  //     const res = await blobClient.uploadData(file.buffer); // upload file data
  //     // return fileUrl; // return url of uploaded file
  //     const result: AzureBlobUploadResponse = {
  //       response: res,
  //       uploadedFileUrl: blobClient.url,
  //       container: this.containerName,
  //       filePath: fileUrl,
  //     };
  //     return result;
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //     throw new Error('Failed to upload file');
  //   }
  // }

  async upload(
    file: Express.Multer.File,
    directory: string,
  ): Promise<AzureBlobUploadResponse> {
    try {
      await this.listContainers();
      this.containerName = this.getContainerName();
      await this.createContainer(this.containerName);
      const fileUrl = makeFileNameTimestamped(file.originalname, directory);
      return this._doUpload(file.buffer, fileUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  async zipAndUpload(
    file: Express.Multer.File,
    directory: string,
  ): Promise<AzureBlobUploadResponse> {
    try {
      const zip = new JSZip();

      let fileUrl = makeFileNameTimestamped(file.originalname, directory);
      const parts = fileUrl.split('.');
      parts.pop(); // remove extension
      parts.push('zip');
      fileUrl = parts.join('.');

      // read file
      zip.file(file.originalname, new Uint8Array(file.buffer));

      //generate zip content
      const zipContent = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
      });

      return this._doUpload(zipContent, fileUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  async _doUpload(
    fileBuffer: Buffer,
    //directory: string,
    fileUrl: string,
  ): Promise<AzureBlobUploadResponse> {
    try {
      await this.listContainers();
      this.containerName = this.getContainerName();
      await this.createContainer(this.containerName);
      const blobClient = await this.getBlobClient(fileUrl);

      //const res = await blobClient.uploadData(fileBuffer); // upload file data
      // Upload data in blocks. Its more efficient than not the vanilla uploadData
      const res = await blobClient.uploadData(fileBuffer, {
        // Optional: specify block size and concurrency for large files
        blockSize: 4 * 1024 * 1024, // 4MB
        concurrency: 20,
        onProgress: (ev) => console.log(ev), // Optional progress tracking
      });

      const result: AzureBlobUploadResponse = {
        response: res,
        uploadedFileUrl: blobClient.url,
        container: this.containerName,
        filePath: fileUrl,
      };
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
    const fileName = extractFileNameFromBlobUrl(blobName);
    this.containerName = this.getContainerName(); //containerName
    const blobClient = this.getBlobClient(
      fileName, //`${directory}/${blobName}` /*blobName*/,
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
    const fileName = extractFileNameFromBlobUrl(blobName);
    const blobClient = this.getBlobClient(fileName); //fileName);
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
