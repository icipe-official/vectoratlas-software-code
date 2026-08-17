import axios, { AxiosError } from 'axios';
import https from 'https';
import download from 'js-file-download';
import { marked } from 'marked';
import { DatasetFileType, SpeciesInformation } from '../state/state.types';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../state/hooks';
import {
  setEndRow,
  setStartRow,
  setTotalRows,
} from '../state/uploadedDataset/uploadedDatasetSlice';
import { start } from 'repl';
import { debug, error } from 'console';
import { getUniqueObjectValues } from '../utils/utils';
import FormData from 'form-data';
import pako from 'pako';

export const createBackgroundExport = async (payload: {
  filtersJson: string;
  generateDoi?: boolean;
  downloaderName?: string;
  downloaderEmail?: string;

  occurrenceIds?: string[];
}) => {
  // compress ids
  const gzipped = pako.gzip(JSON.stringify(payload.occurrenceIds || []));

  const blob = new Blob([gzipped], { type: 'application/gzip' });
  const formData = new FormData();

  // gzip file
  formData.append('idFile', blob, 'ids.gz');
  formData.append('filtersJson', payload.filtersJson);
  formData.append('generateDoi', payload.generateDoi);
  formData.append('downloaderName', payload.downloaderName);
  formData.append('downloaderEmail', payload.downloaderEmail);

  //const res = await axios.post(`${apiUrl}exports`, payload);
  const res = await axios.post(`${apiUrl}exports`, formData);
  return res.data;
};

export const getBackgroundExportStatus = async (jobId: string) => {
  const res = await axios.get(`${apiUrl}exports/${jobId}`);
  return res.data;
};
const protectedUrl = '/api/protected/';
export const apiUrl = '/vector-api/';
const graphQlUrl = '/vector-api/graphql';

const LONG_TIMEOUT = 1000 * 60 * 30; // wait for 30 minutes

export const fetchLocalVersion = async () => {
  const res = await axios.get('/version.txt');
  return res.data;
};

export const sendNewEmail = async (formData: any) => {
  const res = await axios.post(`${apiUrl}mailService/sendNewEmail`, formData);
  return res.data;
};

export const updatePointData = async (pointData: any) => {
  const res = await axios.post(
    `${apiUrl}occurrence/modifyPointData`,
    pointData
  );
  return res.data;
};

export const getPointData = async (
  entityType: string,
  occurrenceId: string
) => {
  const res = await axios.get(
    `${apiUrl}/occurrence/getPointData/${entityType}/${occurrenceId}`
  );
  return res.data;
};

export const getPointDataBySource = async (sourceId: string) => {
  const res = await axios.get(
    `${apiUrl}/occurrence/getPointDataBySource/${sourceId}`
  );
  return res.data;
};

export const getAllEditLogs = async () => {
  try {
    const res = await axios.get(`${apiUrl}/edit-logs/getAllLogs`);
    return res.data;
  } catch (error) {
    console.error('Failed to fetch edit logs:', error);
    throw error;
  }
};

export const modifyFullPointData = async (
  data: any,
  entityType: string,
  currentUser: any,
  reasonForEdit: any
) => {
  const res = await axios.post(`${apiUrl}/occurrence/modifyFullPointData`, {
    body: data,
    entityType: entityType,
    editor: currentUser,
    reasonForEdit: reasonForEdit,
  });
  return res.data;
};

export const fetchApiVersion = async () => {
  const res = await axios.get(`${apiUrl}config/version`);
  return res.data;
};

export const fetchFeatureFlags = async () => {
  const res = await axios.get(`${apiUrl}config/featureFlags`);
  return res.data;
};

export const fetchTemplateList = async () => {
  const res = await axios.get(`${apiUrl}config/mapping-templates`);
  return res.data;
};

export const fetchMapStyles = async () => {
  const res = await axios.get(`${apiUrl}config/map-styles`);
  return res.data;
};

export const fetchTileServerOverlays = async () => {
  const res = await axios.get(`${apiUrl}config/tile-server-overlays`);
  return res.data;
};

export const fetchSpeciesList = async () => {
  const res = await axios.get(`${apiUrl}config/species-list`);
  return res.data;
};

export const fetchAllData = async () => {
  const res = await axios.get(`${apiUrl}export/downloadAll`);
  return download(res.data, 'downloadAll.csv');
};

export const fetchUploadedDatasetList = async () => {
  const res = await axios.get(`${apiUrl}/uploaded-dataset`);
  return res.data;
};

export const fetchUploadedDataset = async (datasetId: string) => {
  const res = await axios.get(`${apiUrl}/uploaded-dataset/${datasetId}`);
  return res.data;
};

export const fetchDoiList = async () => {
  const res = await axios.get(`${apiUrl}/doi`);
  return res.data;
};

export const fetchDoi = async (doiId: string) => {
  const res = await axios.get(`${apiUrl}/doi/${doiId}`);
  return res.data;
};

export const fetchUploadedDatasetLogsByDatasetAuthenticated = async (
  token: String,
  datasetId: string
) => {
  // const res = await axios.get(`${apiUrl}/uploaded-dataset-log/`, {
  //   params: { datasetId: datasetId },
  // });
  // return res.data;
  const url = `${apiUrl}/uploaded-dataset/uploaded-dataset-log`;
  const res = await axios.get(url, {
    params: { datasetId: datasetId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const approveUploadedDatasetAuthenticated = async (
  token: String,
  datasetId: string,
  comments?: string
) => {
  const url = `${apiUrl}uploaded-dataset/approve`;
  const res = await axios.post(
    url,
    { datasetId, comments: comments },
    {
      params: { id: datasetId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: LONG_TIMEOUT, // wait for a while before timeout
    }
  );
  return res;
};

/**
 * Function to initiate approval of datasets. If there are no issues found, the import process
 * is initiated, and then the UI later monitors if the ingestion has been completed
 * @param token
 * @param datasetId
 * @param comments
 * @returns
 */
export const approveUploadedDatasetAuthenticated_v2 = async (
  token: String,
  datasetId: string,
  aggregateErrors: boolean = false,
  dispatch: any,
  comments?: string
) => {
  aggregateErrors = true; // Set this to True to ensure the entire dataset is ingested
  // const formData = new FormData();
  // formData.append('datasetId', datasetId);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    timeout: LONG_TIMEOUT, // wait for a while before timeout
  };
  let url = `${apiUrl}uploaded-dataset/approve_v2`;
  let res = {
    data: {
      success: false,
      has_more_data: false,
      errors: {},
      dst_file: null,
      total_rows: 0,
      error: null,
    },
    error: null,
  };

  try {
    // keep looping until the backend says no more data to validate
    let startRow = 0;
    // let chunkSize = process.env.NEXT_PUBLIC_DATA_UPLOAD_CHUNK_SIZE
    //   ? parseInt(process.env.NEXT_PUBLIC_DATA_UPLOAD_CHUNK_SIZE)
    //   : 1000;
    let chunkSize = 50000;

    let has_more_data = true;
    let srcFile = null;

    // const aggregateErrors = true;
    let errors = <any>[];
    let endRow = 0;
    let totalRows = 0;
    const errorDict = {};

    while (has_more_data) {
      dispatch(setStartRow(startRow + 1));
      dispatch(setEndRow(startRow + chunkSize));
      const formData = new FormData();
      formData.append('datasetId', datasetId);
      formData.append('startRow', (startRow || 0).toString());
      formData.append('chunkSize', (chunkSize || 0).toString());
      formData.append('srcFile', srcFile || '');
      formData.append('comments', comments || '');
      res = await axios.post(url, formData, config);

      const isValid = res.data?.success;
      has_more_data = res.data?.has_more_data;

      totalRows = res.data.total_rows;
      // if (isValid) {
      //   has_more_data = res.data?.has_more_data;
      // } else {
      if (!aggregateErrors) {
        // If we are not aggregating errors, just return
        break; // return res;
      }
      if (!isValid) {
        if (!aggregateErrors) {
          // If there are errors, break and report back
          errors = res.data?.errors;
          return res;
        }

        // check if its a general error related to the dataset and not specific to data
        if (res.data.error) {
          return res;
        }

        for (const [key, value] of Object.entries(res.data?.errors || {})) {
          appendToDict(errorDict, key, value as string[]);
        }
        // errors = errors.concat(res.data?.errors);
      }
      if (res.data?.dst_file) {
        srcFile = res.data?.dst_file;
      }
      startRow += chunkSize;
      endRow = startRow + chunkSize;
    }

    if (aggregateErrors) {
      res.data['errors'] = errorDict; // errors;
      res.data['success'] = !hasAnyValue(errorDict);
    }
    // const groupedRows = Object.entries(res.data?.errors || {}).flatMap(
    //   ([type, items]) =>
    //     (items as any[]).map((item, index) => ({
    //       row: item.row,
    //       error_type: type,
    //       error: item.error,
    //     }))
    // );

    // const errorRows = getUniqueObjectValues(groupedRows, 'row');
    // await updateValidationResults(
    //   token,
    //   datasetId,
    //   res.data.total_rows || 0,
    //   aggregateErrors ? 1 : startRow,
    //   endRow < totalRows ? endRow : totalRows,
    //   errorRows || [],
    //   groupedRows,
    //   dispatch
    // );
    return res;
  } catch (error) {
    console.error('Error posting data:', error); // Handle errors here

    // try rolling back
    await rollbackApproval(
      datasetId,
      (error as string).toString(),
      token as string
    );

    toast.error(error?.toString());
  }
  return res;
  // const url = `${apiUrl}uploaded-dataset/approve_v2`;
  // const res = await axios.post(
  //   url,
  //   { datasetId, comments: comments },
  //   {
  //     params: { id: datasetId },
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     timeout: LONG_TIMEOUT, // wait for a while before timeout
  //   }
  // );

  // const intervalId = setInterval(async () => {
  //   let progressRes = await axios.post(
  //     `${apiUrl}uploaded-dataset/ingest_progress`,
  //     { datasetId, comments: comments },
  //     {
  //       params: { id: datasetId },
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       timeout: LONG_TIMEOUT, // wait for a while before timeout
  //     }
  //   );
  //   const progress = progressRes.data.progress;
  //   const status = progressRes.data.status;

  //   if (progress != 0 && status != 'Completed') {
  //     clearInterval(intervalId);
  //   }
  // }, 1000);
  // return res;
};

export const rollbackApproval = async (
  datasetId: string,
  error: string,
  token: string
) => {
  try {
    let url = `${apiUrl}uploaded-dataset/rollback`;
    const formData = new FormData();
    const files = Array<File>();
    formData.append('datasetId', datasetId);
    formData.append('error', error);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };
    const res = await axios.post(url, formData, config);
    return res; // res.data;
  } catch (error) {
    console.log('Error performing DB rollback');
  }
};

export const rejectUploadedDatasetAuthenticated = async (
  token: String,
  datasetId: string,
  comments?: string
) => {
  const url = `${apiUrl}/uploaded-dataset/reject-raw-dataset`;
  const res = await axios.post(
    url,
    { datasetId, comments: comments },
    {
      params: { id: datasetId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const reviewUploadedDatasetAuthenticated = async (
  token: String,
  datasetId: string,
  comments?: string
) => {
  const url = `${apiUrl}/uploaded-dataset/review/`;
  const res = await axios.post(
    url,
    { datasetId, comments: comments },
    {
      params: { id: datasetId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const assignPrimaryReviewersAuthenticated = async (
  token: String,
  datasetId: string,
  primaryReviewers: string[],
  comments?: string
) => {
  const url = `${apiUrl}/uploaded-dataset/assign-primary-reviewer`;
  const res = await axios.post(
    url,
    { datasetId, primaryReviewers, comments },
    {
      params: { id: datasetId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const assignTertiaryReviewersAuthenticated = async (
  token: String,
  datasetId: string,
  tertiaryReviewers: string[],
  isReassignment: boolean = false,
  comments?: string
) => {
  const url = `${apiUrl}/uploaded-dataset/assign-tertiary-reviewer`;
  const res = await axios.post(
    url,
    { datasetId, tertiaryReviewers, isReassignment, comments },
    {
      params: { id: datasetId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const adhocCommunicationUploadedDatasetAuthenticated = async (
  token: String,
  datasetId: string,
  message: string,
  recipients: string[],
  files?: File | File[]
) => {
  const url = `${apiUrl}/uploaded-dataset/adhoc-communication`;
  const formData = new FormData();
  formData.append('datasetId', datasetId);
  formData.append('message', message);
  if (Array.isArray(recipients)) {
    recipients.forEach((rec) => {
      formData.append('recipients', rec);
    });
  } else {
    formData.append('recipients', recipients);
  }
  const dummyArray: File[] = [];
  // const htmlBody = await marked(body);
  const finalFiles = files ? dummyArray.concat(files) : [];

  finalFiles?.forEach((file) => {
    formData.append('files', file);
  });

  const res = await axios.post(url, formData, {
    params: { id: datasetId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const downloadModelOutputData = async (blobLocation: string) => {
  const res = await axios.post(
    `${apiUrl}models/download`,
    {
      blobLocation,
    },
    {
      responseType: 'blob',
    }
  );
  return res.data;
};

export const downloadTemplateFile = async (
  dataType: string,
  dataSource: string,
  extension: string = ''
) => {
  let url = `${apiUrl}ingest/downloadTemplate?type=${dataType}&source=${dataSource}`;
  if (extension.length > 0) {
    url += `&extension=${extension}`;
  }

  const res = await axios({
    url: url,
    method: 'GET',
    responseType: 'blob',
  });
  return download(res.data, `${dataSource}_${dataType}.${extension}`);
};

export const downloadDataset = async (
  datasetId: string,
  fileType: DatasetFileType
) => {
  let url = '';
  if (fileType === 'Raw') {
    url = `${apiUrl}uploaded-dataset/download-raw/${datasetId}`;
  }
  if (fileType === 'Primary Approved') {
    url = `${apiUrl}uploaded-dataset/download-primary-approved/${datasetId}`;
  }
  if (fileType === 'Tertiary Approved') {
    url = `${apiUrl}uploaded-dataset/download-tertiary-approved/${datasetId}`;
  }
  // const res = await axios.get(url);
  const res = await axios({
    url: `${url}`,
    method: 'GET',
    responseType: 'blob',
  }).then((response) => {
    return response;
  });

  // try extract the file name and extension
  let fileName;
  try {
    const matches = res.headers['content-disposition'].match(
      /filename\*?=((['"])[\s\S]*?\2|[^;\n]*)/g
    );
    if (matches && matches.length > 0) {
      fileName = matches?.[0].replace('filename=', '');
      fileName = fileName.replace(/\"/g, '');
    } else {
      fileName = `${datasetId}-dataset`;
    }
  } catch {}
  return download(res.data, `${fileName}`);
};

export const downloadModel = async (modelId: string) => {
  let url = `${apiUrl}uploaded-model/download/${modelId}`;

  // const res = await axios.get(url);
  const res = await axios({
    url: `${url}`,
    method: 'GET',
    responseType: 'blob',
  }).then((response) => {
    return response;
  });

  // try extract the file name and extension
  let fileName;
  try {
    const matches = res.headers['content-disposition'].match(
      /filename\*?=((['"])[\s\S]*?\2|[^;\n]*)/g
    );
    if (matches && matches.length > 0) {
      fileName = matches?.[0].replace('filename=', '');
      fileName = fileName.replace(/\"/g, '');
    } else {
      fileName = `${modelId}-model`;
    }
  } catch {}
  return download(res.data, `${fileName}`);
};

export const deleteUploadedModelAuthenticated = async (
  token: String,
  modelId: String
) => {
  const payload = {
    modelId,
  };
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(
    `${apiUrl}uploaded-model/delete/${modelId}`,
    payload,
    config
  );
  return await res.data;
};

export const deleteUploadedDatasetAuthenticated = async (
  token: String,
  modelId: String
) => {
  const payload = {
    modelId,
  };
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(
    `${apiUrl}uploaded-dataset/delete/${modelId}`,
    payload,
    config
  );
  return await res.data;
};

// export const downloadPrimarRawDatasetFile = async (datasetId: string) => {
//   const res = await axios.get(
//     // `${apiUrl}uploaded-dataset/downloadRaw?id=${datasetId}`
//     `${apiUrl}uploaded-dataset/download-raw?id=${datasetId}`
//   );
//   return download(res.data, `${datasetId}-dataset`);
// };

// export const downloadConvertedDatasetFile = async (datasetId: string) => {
//   const res = await axios.get(
//     `${apiUrl}uploaded-dataset/download-converted?id=${datasetId}`
//   );
//   return download(res.data, `${datasetId}-dataset`);
// };

export const fetchAuth = async () => {
  const res = await axios.get(`${protectedUrl}auth`);
  return res.data;
};

export const fetchGraphQlData = async (query: String) => {
  const body = {
    query: query,
  };
  const res = await axios.post(graphQlUrl, body);
  return res.data;
};

export const fetchGraphQlDataAuthenticated = async (
  query: String,
  token: String
) => {
  const body = {
    query: query,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const res = await axios.post(graphQlUrl, body, config);
  return res.data;
};

export const postModelFileAuthenticated = async (
  file: File,
  token: String,
  displayName: String,
  maxValue: String,
  generateDoi: boolean,
  authors?: string,
  institution?: string,
  country?: string,
  providedDoi?: string,
  comments?: string
) => {
  const formData = new FormData();
  formData.append('displayName', displayName.toString());
  formData.append('maxValue', maxValue.toString());
  formData.append('generateDoi', generateDoi.toString());
  formData.append('authors', authors || '');
  formData.append('institution', institution || '');
  formData.append('country', country || '');
  formData.append('providedDoi', providedDoi || '');
  formData.append('comments', comments || '');
  formData.append('file', file);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  try {
    const res = await axios.post(`${apiUrl}models/upload`, formData, config);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMsg = error.response?.data?.message;
      return { errors: errorMsg };
    } else {
      //toast.error(error?.toString());
    }
    return { errors: error };
  }
};

export const postDatasetFileAuthenticated = async (
  file: File,
  token: String,
  title: String,
  author: String,
  description: String,
  affiliated_institution: String,
  country: String,
  region: String,
  dataType?: String,
  dataSource?: String,
  datasetId?: String,
  doi?: String,
  generateDoi?: Boolean,
  isValidated?: Boolean
) => {
  const formData = new FormData();
  formData.append('file', file);
  const data = {
    dataType,
    dataSource,
    datasetId,
    provided_doi: doi,
    title,
    author,
    description,
    affiliated_institution,
    source_country: country,
    source_region: region,
    is_doi_requested: generateDoi,
    is_va_data: false,
    is_validated: isValidated,
    dataset_type: dataType,
  };
  formData.append('data', JSON.stringify(data));

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  let url = `${apiUrl}uploaded-dataset/upload-dataset`;
  const res = await axios.post(url, formData, config);
  return res; // res.data;
};

export const fetchUploadedModelLogsByModelAuthenticated = async (
  token: String,
  modelId: string
) => {
  // const res = await axios.get(`${apiUrl}/uploaded-dataset-log/`, {
  //   params: { datasetId: datasetId },
  // });
  // return res.data;
  const url = `${apiUrl}/uploaded-model/uploaded-model-log`;
  const res = await axios.get(url, {
    params: { modelId: modelId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

// export const postDatasetFileAuthenticated = async (
//   file: File,
//   token: string,
// ) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'multipart/form-data',
//     },
//   };
//   const res = await axios.post(`${apiUrl}datasets/upload`, formData, config);
//   return res.data;
// };

export const adhocCommunicationUploadedModelAuthenticated = async (
  token: String,
  modelId: string,
  message: string,
  recipients: string[],
  files?: File | File[]
) => {
  const url = `${apiUrl}/uploaded-model/adhoc-communication`;
  const formData = new FormData();
  formData.append('modelId', modelId);
  formData.append('message', message);
  if (Array.isArray(recipients)) {
    recipients.forEach((rec) => {
      formData.append('recipients', rec);
    });
  } else {
    formData.append('recipients', recipients);
  }
  const dummyArray: File[] = [];
  // const htmlBody = await marked(body);
  const finalFiles = files ? dummyArray.concat(files) : [];

  finalFiles?.forEach((file) => {
    formData.append('files', file);
  });

  const res = await axios.post(url, formData, {
    params: { id: modelId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const getDatasetData = async (datasetId: string) => {
  const url = `${apiUrl}dataset-upload/${datasetId}`;
  return axios.get(url);
};

export const approveDatasetAuthenticated = async (
  token: String,
  datasetId: String
) => {
  const url = `${apiUrl}review/approve?datasetId=${datasetId}`;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(url, {}, config);
  return res;
};

export const reviewDatasetAuthenticated = async (
  token: String,
  datasetId: String,
  reviewComments: string
) => {
  const url = `${apiUrl}review/review?datasetId=${datasetId}`;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(url, { reviewComments }, config);
  return res;
};

export const postDataFileValidated = async (
  file: File,
  token: String,
  dataType: String,
  dataSource: String
) => {
  const formData = new FormData();
  formData.append('file', file);
  const instance = axios.create({
    timeout: 10000,
    httpAgent: new https.Agent({ keepAlive: true }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  let url = `${apiUrl}validation/validateUpload?dataSource=${dataSource}&dataType=${dataType}`;
  const res = await instance.post(url, formData);
  return res; // res.data;
};

export const assignUploadedDatasetPrimaryReviewerAuthenticated = async (
  datasetId: string,
  token: string,
  primaryReviewers: string[],
  comments: string
) => {
  const payload = {
    datasetId,
    primaryReviewers,
    comments,
  };
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(
    `${apiUrl}uploaded-dataset/assign-primary-reviewer`,
    payload,
    config
  );
  return res; // res.data;
};

export const assignUploadedDatasetTertiaryReviewerAuthenticated = async (
  datasetId: string,
  token: string,
  tertiaryReviewers: string[],
  comments: string
) => {
  const payload = {
    datasetId,
    tertiaryReviewers,
    comments,
  };
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(
    `${apiUrl}uploaded-dataset/assign-tertiary-reviewer`,
    payload,
    config
  );
  return res; //res.data;
};

export const completePrimaryReviewedUploadedDatasetAuthenticated = async (
  files: File | File[],
  token: string,
  datasetId: string,
  comments?: string
) => {
  const arry = new Array<any>();
  const formData = new FormData();
  const finalFiles = arry.concat(files);
  finalFiles.map((fl) => {
    formData.append('file', fl);
  });

  formData.append('datasetId', datasetId);
  formData.append('comments', comments || 'Complete Primary Review');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  let url = `${apiUrl}uploaded-dataset/complete-primary-review?`;
  if (datasetId) {
    url = `${url}&datasetId=${datasetId}`;
  }
  // if (comments) {
  //   url = `${url}&comments=${comments}`;
  // }
  const res = await axios.post(url, formData, config);
  return res; // res.data;
};

export const completeTertiaryReviewedUploadedDatasetAuthenticated = async (
  file: File | File[],
  token: string,
  datasetId: string,
  comments: string
) => {
  const formData = new FormData();
  const files = Array<File>();
  formData.append('datasetId', datasetId);
  formData.append('comments', comments);
  const finalFiles = files.concat(file);
  finalFiles.map((fl) => {
    formData.append('file', fl);
  });
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  let url = `${apiUrl}uploaded-dataset/complete-tertiary-review?`;
  if (datasetId) {
    url = `${url}&datasetId=${datasetId}`;
  }
  const res = await axios.post(url, formData, config);
  return res; // res.data;
};

/**
 * Validate uploaded dataset that has completed tertiary review
 * @param token
 * @param datasetId
 * @returns
 */
export const validateUploadedDatasetAuthenticated = async (
  token: string,
  datasetId: string
) => {
  const formData = new FormData();
  formData.append('datasetId', datasetId);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    timeout: LONG_TIMEOUT, // wait for a while before timeout
  };
  let url = `${apiUrl}uploaded-dataset/validate`;
  try {
    const res = await axios.post(url, formData, config);
    return res;
  } catch (error) {
    console.error('Error posting data:', error); // Handle errors here
  }
};

/**
 * Validate uploaded dataset that has completed tertiary review in async mode
 * @param token
 * @param datasetId
 * @returns
 */
export const validateUploadedDatasetAuthenticated_v2 = async (
  token: string,
  datasetId: string,
  aggregateErrors: boolean = false,
  dispatch: any
) => {
  const formData = new FormData();
  formData.append('datasetId', datasetId);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    timeout: LONG_TIMEOUT, // wait for a while before timeout
  };
  let url = `${apiUrl}uploaded-dataset/validate_v2`;

  try {
    // keep looping until the backend says no more data to validate
    let startRow = 0;
    let chunkSize = process.env.NEXT_PUBLIC_DATA_UPLOAD_CHUNK_SIZE
      ? parseInt(process.env.NEXT_PUBLIC_DATA_UPLOAD_CHUNK_SIZE)
      : 1000;

    let has_more_data = true;
    let srcFile = null;
    let res = {
      data: {
        valid_data: false,
        has_more_data: false,
        errors: {},
        dst_file: null,
        total_rows: 0,
      },
    };
    // const aggregateErrors = true;
    let errors = <any>[];
    let endRow = 0;
    let totalRows = 0;
    const errorDict = {};
    while (has_more_data) {
      dispatch(setStartRow(startRow + 1));
      dispatch(setEndRow(startRow + chunkSize));
      const formData = new FormData();
      formData.append('datasetId', datasetId);
      formData.append('startRow', (startRow || 0).toString());
      formData.append('chunkSize', (chunkSize || 0).toString());
      formData.append('srcFile', srcFile || '');

      res = await axios.post(url, formData, config);
      const isValid = res.data?.valid_data;
      has_more_data = res.data?.has_more_data;

      totalRows = res.data.total_rows;
      // if (isValid) {
      //   has_more_data = res.data?.has_more_data;
      // } else {
      if (!aggregateErrors) {
        // If we are not aggregating errors, just return
        break; // return res;
      }
      if (!isValid) {
        if (!aggregateErrors) {
          // If there are errors, break and report back
          errors = res.data?.errors;
          return res;
        }

        for (const [key, value] of Object.entries(res.data?.errors || {})) {
          appendToDict(errorDict, key, value as string[]);
        }
        // errors = errors.concat(res.data?.errors);
      }
      if (res.data?.dst_file) {
        srcFile = res.data?.dst_file;
      }
      startRow += chunkSize;
      endRow = startRow + chunkSize;
    }
    if (aggregateErrors) {
      res.data['errors'] = errorDict; // errors;
      res.data['valid_data'] = !hasAnyValue(errorDict);
    }
    const groupedRows = Object.entries(res.data?.errors || {}).flatMap(
      ([type, items]) =>
        (items as any[]).map((item, index) => ({
          row: item.row,
          error_type: type,
          error: item.error,
        }))
    );

    const errorRows = getUniqueObjectValues(groupedRows, 'row');
    await updateValidationResults(
      token,
      datasetId,
      res.data.total_rows || 0,
      aggregateErrors ? 1 : startRow,
      endRow < totalRows ? endRow : totalRows,
      errorRows || [],
      groupedRows,
      dispatch
    );
    return res;
  } catch (error) {
    console.error('Error posting data:', error); // Handle errors here
  }
};

const updateValidationResults = async (
  token: String,
  datasetId: string,
  totalRows: number,
  startRow: number,
  endRow: number,
  invalidRows: number[],
  validationErrors: object[],
  dispatch: any
) => {
  const formData = new FormData();
  formData.append('datasetId', datasetId);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    timeout: LONG_TIMEOUT, // wait for a while before timeout
  };
  let url = `${apiUrl}uploaded-dataset/updateValidationResults`;

  try {
    dispatch(setTotalRows(totalRows));
    const formData = new FormData();
    formData.append('datasetId', datasetId.toString());
    formData.append('totalRows', totalRows.toString());
    formData.append('startRow', (startRow || 0).toString());
    formData.append('endRow', (endRow || 0).toString());
    formData.append('invalidRows', JSON.stringify(invalidRows));
    formData.append('validationErrors', JSON.stringify(validationErrors));
    const res = await axios.post(url, formData, config);
    return res;
  } catch (error) {
    console.error('Error posting data:', error); // Handle errors here
  }
};

/**
 * Check if an object has a value
 * @param obj
 * @returns
 */
function hasAnyValue(obj: any) {
  const hasValue = Object.values(obj).some((value) => {
    if (Array.isArray(value)) return value.length > 0;

    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length > 0;
    }

    return Boolean(value);
  });
  return hasValue;
}

// Function to append values to a dictionary key
function appendToDict(dict: any, key: string, values: string[]): void {
  // If the key doesn't exist, create a new array
  if (!dict[key]) {
    dict[key] = [];
  }
  // Append new values
  dict[key].push(...values);
}

/**
 * Validate an adhoc dataset
 * @param file
 * @param token
 * @returns
 */
export const adhocValidateUploadedDatasetAuthenticated = async (
  file: File | File[],
  token: string
) => {
  const files = Array<File>();
  const formData = new FormData();
  const finalFiles = files.concat(file);
  finalFiles.map((fl) => {
    formData.append('file', fl);
  });
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    timeout: LONG_TIMEOUT, // wait for a while before timeout
  };
  let url = `${apiUrl}uploaded-dataset/adhoc-validate`;
  const res = await axios.post(url, formData, config);
  return res;
};

export const requestDatasetReuploadAuthenticated = async (
  token: string,
  datasetId: string,
  comments?: string
) => {
  // const formData = new FormData();
  // formData.append('datasetId', datasetId);
  // formData.append('comments', comments || 'Request dataset re-upload');

  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     'Content-Type': 'multipart/form-data',
  //   },
  // };
  // let url = `${apiUrl}uploaded-dataset/request-reupload`;
  const url = `${apiUrl}/uploaded-dataset/request-reupload`;
  const res = await axios.post(
    url,
    { datasetId, comments },
    {
      params: { id: datasetId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export const reuploadDatasetAuthenticated = async (
  token: string,
  datasetId: string,
  file: File | File[],
  comments: string
) => {
  const formData = new FormData();
  const files = Array<File>();
  formData.append('datasetId', datasetId);
  formData.append('comments', comments);
  const finalFiles = files.concat(file);
  finalFiles.map((fl) => {
    formData.append('file', fl);
  });
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  let url = `${apiUrl}uploaded-dataset/reupload-dataset`;
  const res = await axios.post(url, formData, config);
  return res; // res.data;
};

export const approveDoiAuthenticated = async (
  token: String,
  doiId: String,
  comments?: string,
  recipients?: string[]
) => {
  const payload = {
    doiId,
    recipients,
    comments,
  };
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.post(
    `${apiUrl}doi/approve?id=${doiId}`,
    payload,
    config
  );
  return await res; // res.data;
};

export const rejectDoiAuthenticated = async (
  token: String,
  doiId: String,
  comments?: string,
  recipients?: string[]
) => {
  const payload = {
    doiId,
    recipients,
    comments,
  };
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(
    `${apiUrl}doi/reject?id=${doiId}`,
    payload,
    config
  );
  return res.data;
};

export const fetchAllUsersByRole = async (role: string) => {
  const res = await axios.post(`${apiUrl}auth/usersByRole`, { role });
  return res.data;
};

export const fetchAllUsersDetails = async (token: String, userId: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const res = await axios.post(`${apiUrl}auth/userDetails`, { userId }, config);
  return res.data;
};

export const fetchManyUsersDetails = async (
  token: String,
  userIds: string[]
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const ids = userIds.join(',');
  const res = await axios.post(
    `${apiUrl}auth/manyUserDetails`,
    { userIds: ids },
    config
  );
  return res.data;
};

export const fetchAllUsers = async () => {
  const res = await axios.get(`${apiUrl}auth/users`);
  return res.data;
};

export const rejectRawDataset = async (datasetId: string, comments: string) => {
  const payload = {
    datasetId,
    comments,
  };

  const res = await axios.post(
    `${apiUrl}uploaded-dataset/rejectRawDatasets`,
    payload
  );
  return res.data;
};

export const rejectReviewedDatasets = async (
  datasetId: string,
  comments: string
) => {
  const payload = {
    datasetId,
    comments,
  };

  const res = await axios.post(
    `${apiUrl}uploaded-dataset/rejectReviewedDatasets`,
    payload
  );
  return res.data;
};

export const uploadSpeciesImageAuthenticated = async (
  file: File,
  token: string
) => {
  const formData = new window.FormData(); // Uses the browser's native FormData
  formData.append('file', file);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  //  Points directly to your active NestJS controller route!
  const res = await axios.post(
    `${apiUrl}species-information/upload-image`,
    formData,
    config
  );

  return res.data;
};
