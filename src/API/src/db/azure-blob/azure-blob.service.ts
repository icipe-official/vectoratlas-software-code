import {
  BlobDownloadResponseParsed,
  BlobItem,
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
      this.getContainerName(),
    );
    const blobClient = containerClient.getBlockBlobClient(datasetName);
    return blobClient;
  };

  getContainerClient = () => {
    const blobServiceClient = this.createConnectionClient();
    return blobServiceClient;
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
    file: Express.Multer.File | Buffer,
    directory: string,
    fileName?: string,
  ): Promise<AzureBlobUploadResponse> {
    try {
      await this.listContainers();
      this.containerName = this.getContainerName();
      await this.createContainer(this.containerName);
      let fileUrl = null;
      if (!Buffer.isBuffer(file)) {
        fileUrl = makeFileNameTimestamped(file.originalname, directory);
        return this._doUpload(file.buffer, fileUrl);
      } else {
        fileUrl = makeFileNameTimestamped(
          fileName || Date.now().toString(),
          directory,
        );
        return this._doUpload(file, fileUrl);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  async zipAndUpload(
    file: Express.Multer.File | Buffer,
    directory: string,
    zipFileName?: string,
  ): Promise<AzureBlobUploadResponse> {
    try {
      let fileUrl = null;
      const zip = new JSZip();
      if (!Buffer.isBuffer(file)) {
        fileUrl = makeFileNameTimestamped(file.originalname, directory);
        const parts = fileUrl.split('.');
        parts.pop(); // remove extension
        parts.push('zip');
        fileUrl = parts.join('.');

        // read file
        zip.file(file.originalname, file.buffer);
      } else {
        fileUrl = makeFileNameTimestamped(zipFileName, directory);
        zip.file(`${fileUrl}`, file, {
          binary: true,
        });
      }
      console.log('About to generateAsync');

      //generate zip content
      const zipContent = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
      });
      console.log('zipped Content');

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
      console.log('About to list containers');
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

      console.log('Uploaded to containers');

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
    directory: string,
    destinationFileName: string,
  ): Promise<BlobDownloadResponseParsed> => {
    const path = `${directory}/${blobName}`;
    const fileName = extractFileNameFromBlobUrl(blobName);
    this.containerName = this.getContainerName();
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

  getDownloadUrl = async (
    blobName: string,
    // containerName: string,
    destinationFileName: string,
  ): Promise<string> => {
    //Promise<any> => {
    //} Promise<BlobDownloadResponseParsed> => {

    // `blobName =
    //   '`https://vectoratlas.blob.core.windows.net/vectoratlas-container-test/exports/955827c1-95c8-465c-b8e0-a31b77310144_filteredData-955827c1-95c8-465c-b8e0-a31b77310144-20260610080451204.zip?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2050-12-14T15:10:26Z&st=2022-12-14T07:10:26Z&spr=https&sig=x14LR9kSro%2FTyAMhHaSsyWJlqjuQmrODr72F371fEPA%3D';
    this.containerName = this.getContainerName();
    const fileName = extractFileNameFromBlobUrl(blobName);
    const blobClient = this.getBlobClient(fileName); //fileName);
    return blobClient.url;
  };

  listBlobsFlat = async (containerName?: string) => {
    const containerClient = this.createConnectionClient().getContainerClient(
      containerName ?? this.getContainerName(),
    );
    if (!(await containerClient.exists())) {
      console.log(`Container ${containerClient} does not exist`);
      return true;
    }

    return await containerClient.listBlobsFlat();
  };

  getAllBlobs = async (
    containerName?: string,
    directory?: string,
  ): Promise<BlobItem[]> => {
    const blobs: BlobItem[] = [];
    const containerClient = this.createConnectionClient().getContainerClient(
      containerName ?? this.getContainerName(),
    );
    const iterator = containerClient.listBlobsFlat({
      prefix: directory,
    });

    for await (const blob of iterator) {
      blobs.push(blob);
    }
    return blobs;
  };

  /**
   * Looping directly over the async iterator (recommended)
   * Instead of loading everything into memory first, expose the iterator from the service:
   * This second approach is usually better for large containers than `getAllBlobs` because it streams blobs
   * page-by-page rather than building a potentially huge array in memory.
   * @param containerName
   * @param directory
   */
  async *listBlobs(directory?: string) {
    const containerClient = this.createConnectionClient().getContainerClient(
      this.getContainerName(),
    );
    for await (const blob of containerClient.listBlobsFlat({
      prefix: directory,
    })) {
      yield blob;
    }
  }

  // async getAllBlobs(prefix?: string): Promise<BlobItem[]> {
  //   const blobs: BlobItem[] = [];

  //   const iterator = this.containerClient.listBlobsFlat({
  //     prefix,
  //   });

  //   for await (const blob of iterator) {
  //     blobs.push(blob);
  //   }

  //   return blobs;
  // }

  /**
   * Read file from Blob Storage
   * @param fileName
   * @param containerName
   * @returns
   */
  getFile = async (fileName: string, containerName?: string) => {
    this.containerName = containerName ?? this.getContainerName();
    const blobClient = this.getBlobClient(fileName);
    const blobDownloaded = await blobClient.download(); // download file from blob
    return blobDownloaded.readableStreamBody; // Return readable stream of file data
  };
  /**
   * Delete file if exists
   * @param datasetName
   */
  deleteFile = async (fileName: string, containerName?: string) => {
    this.containerName = containerName ?? this.getContainerName();
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
