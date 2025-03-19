import axios from 'axios';
import https from 'https';
import download from 'js-file-download';
import { marked } from 'marked';
import { DatasetFileType } from '../state/state.types';

const protectedUrl = '/api/protected/';
export const apiUrl = '/vector-api/';
const graphQlUrl = '/vector-api/graphql';

export const fetchLocalVersion = async () => {
  const res = await axios.get('/version.txt');
  return res.data;
};

export const sendNewEmail = async (formData: any) => {
  const res = await axios.post(`${apiUrl}mailService/sendNewEmail`, formData);
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
    }
  );
  return res;
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
  dataSource: string
) => {
  const res = await axios.get(
    `${apiUrl}ingest/downloadTemplate?type=${dataType}&source=${dataSource}`
  );
  return download(res.data, `${dataSource}_${dataType}_template.csv`);
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

export const postModelFileAuthenticated = async (file: File, token: String) => {
  const formData = new FormData();
  formData.append('file', file);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  const res = await axios.post(`${apiUrl}models/upload`, formData, config);
  return res.data;
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
  return res.data;
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
  return res.data;
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
  return res.data;
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
  return res.data;
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
  return res.data;
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
  return res.data;
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
  };
  let url = `${apiUrl}uploaded-dataset/validate`;
  const res = await axios.post(url, formData, config);
  return res;
};

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
  };
  let url = `${apiUrl}uploaded-dataset/adhoc-validate`;
  const res = await axios.post(url, formData, config);
  console.log('Validate results 2', res);
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
  return res.data;
};

export const XXX = async () => {
  return { dddd: 'TEST' };
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
  return await res.data;
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
