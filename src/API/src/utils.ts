import * as fs from 'fs';
import { sanitize } from './dataset-upload/utils';
import path from 'path';
import { isKeyObject } from 'util/types';

import crypto from 'crypto';

export function maskEmail(email: string) {
  if (!email || typeof email !== 'string') return 'unknown-user';

  return crypto
    .createHash('sha256')
    .update(email.trim().toLowerCase())
    .digest('hex');
}

export const isEmpty = (object) =>
  Object.values(object).every((x) => x === null || x === '' || x === undefined);

export type DeepPartial<T> = T extends object
  ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  }
  : T;

export const makeDate = (year?: number, month?: number) => {
  if (month && year) {
    return new Date(year, month);
  } else if (year) {
    return new Date(year, 0);
  }
  return null;
};

export const getMappingConfig = (
  dataSource: string,
  dataType: string,
): { 'VA-column': string; 'Template-column': string }[] => {
  return JSON.parse(
    fs.readFileSync(
      process.cwd() +
      `/public/templates/${dataSource}/${dataType}-mapping.json`,
      {
        encoding: 'utf8',
        flag: 'r',
      },
    ),
  );
};

export const transformHeaderRow = (
  csvString: string,
  dataSource: string,
  dataType: string,
): string => {
  let headerRow = csvString.slice(0, csvString.indexOf('\n'));
  const mappingConfig = getMappingConfig(dataSource, dataType);
  mappingConfig.forEach((map) => {
    headerRow = headerRow.replace(
      `${map['Template-column']}`,
      `${map['VA-column']}`,
    );
  });
  return csvString.replace(
    csvString.slice(0, csvString.indexOf('\n')),
    headerRow,
  );
};

export const mapValidationIssues = (
  dataSource: string,
  dataType: string,
  validationIssuesArray: any[],
) => {
  const mappingConfig = getMappingConfig(dataSource, dataType);
  mappingConfig.forEach((config) => {
    validationIssuesArray.map((issue) => {
      issue.key = issue.key.replace(
        `${config['VA-column']}`,
        `${config['Template-column']}`,
      );
    });
  });
  return validationIssuesArray;
};

export const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const M = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate() + 1).padStart(2, '0');
  const h = String(date.getHours() + 1).padStart(2, '0');
  const m = String(date.getMinutes() + 1).padStart(2, '0');
  const s = String(date.getSeconds() + 1).padStart(2, '0');
  const ms = date.getMilliseconds();
  return `${y}${M}${d}${h}${m}${s}${ms}`;
};

export const ensureDirectoryExists = (directoryPath: string) => {
  // Check if the directory exists
  if (!fs.existsSync(directoryPath)) {
    // If it doesn't exist, create the directory
    fs.mkdirSync(directoryPath);
  } else {
  }
};

/**
 * Make a new file name with a timestamp
 * @param fileName
 */
export const makeFileNameTimestamped = (
  fileName: string,
  directory: string,
): string => {
  const sanitizedFile = sanitize(fileName);
  const fileParts = sanitizedFile.split('.');
  const extension = fileParts.pop();
  const destFile =
    /*uuidv4() +*/ `${directory}/` +
    `${fileParts.join('')}-${formatDate(new Date())}.${extension}`;
  return destFile;
};

/**
 * Generic method to construct response object
 * @param isError
 * @param data
 * @param errorMsg
 * @returns
 */
export const makeResponse = ({
  isError,
  data,
  error,
}: {
  isError: boolean;
  data?: object;
  error?: string;
}) => {
  let dataObj = data;
  try {
    if (typeof data === 'string') {
      dataObj = { data: data, success: !isError };
    } else {
      dataObj = { data: { ...data, success: !isError } };
    }
  } catch (error) { }

  const res = {
    success: !isError,
    data: dataObj['data'],
    error,
  };
  return res;
};

export const extractFileNameFromBlobUrl = (blobUrl: string) => {
  // blobUrl =
  //   'https://vectoratlas.blob.core.windows.net/vectoratlas-container/tertiary-reviewed/VA_data_sample_-_FORMATTED_-_No_ERROR_ROW_(1)-20250509082649127.csv?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2050-12-14T15:10:26Z&st=2022-12-14T07:10:26Z&spr=https&sig=x14LR9kSro%2FTyAMhHaSsyWJlqjuQmrODr72F371fEPA%3D';
  // urls come in the form of https://vectoratlas.blob.core.windows.net/vectoratlas-container-test/raw/demo_data_no_merged_cells-20250205191945748-2025020305221324.xlsx?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2050-12-14T15:10:26Z&st=2022-12-14T07:10:26Z&spr=https&sig=x14LR9kSro%2FTyAMhHaSsyWJlqjuQmrODr72F371fEPA%3D
  const parts = blobUrl.split('//'); //split by url scheme
  let res = blobUrl;
  if (parts.length > 1) {
    const fileParts = parts[1].split('/'); // split by /

    // For Azurite (local emulator), URLs include account name (devstoreaccount1)
    // and may have duplicate container segments. Detect and skip appropriately.
    let skipCount = 2; // Default: skip host + container for production Azure

    // Detect Azurite by checking for emulator account name or port in host
    const hostPart = fileParts[0];
    const isAzurite =
      fileParts.includes('devstoreaccount1') ||
      hostPart.includes('azurite') ||
      hostPart.includes('127.0.0.1') ||
      hostPart.includes('localhost');

    if (isAzurite) {
      skipCount = 3; // Azurite: skip host:port + account + container

      // Check for duplicate container name by looking for consecutive identical segments
      // after the host and account parts
      for (let i = 2; i < fileParts.length - 1; i++) {
        if (fileParts[i] === fileParts[i + 1] && fileParts[i].length > 0) {
          // Found duplicate container name, skip both instances
          skipCount = i + 2;
          break;
        }
      }
    }
    res = fileParts.slice(skipCount).join('/'); // remove the host, account (Azurite), and container portions
  }
  return res.split('?')[0];
};

/**
 * Delete file
 * @param filePath
 */
export const deleteFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    try {
      fs.rmSync(filePath);
    } catch (error) {
      console.error('Error deleting file: ', error);
    }
  }
};

/**
 * Read file
 * @param filePath
 */
export const readFileContent = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error('Error deleting file: ', error);
    }
  }
  return null;
};

export const writeFileContent = (filePath: string, content: string) => {
  if (fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, content);
      return true;
    } catch (error) {
      console.error('Error deleting file: ', error);
    }
  }
  return false;
};

export const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};
