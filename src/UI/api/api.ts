import axios from 'axios';
import https from 'https';
import download from 'js-file-download';

const protectedUrl = '/api/protected/';
const apiUrl = '/vector-api/';
const graphQlUrl = '/vector-api/graphql';

export const fetchLocalVersion = async () => {
  const res = await axios.get('/version.txt');
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
  console.log(
    'fetchUploadedDataset:',
    datasetId,
    `${apiUrl}/uploaded-dataset/${datasetId}`
  );
  const res = await axios.get(`${apiUrl}/uploaded-dataset/${datasetId}`);
  return res.data;
};

export const fetchUploadedDatasetLogsByDatasetAuthenticated = async (
  //token: String,
  datasetId: string
) => {
  const res = await axios.get(`${apiUrl}/uploaded-dataset-log/`, {
    params: { datasetId: datasetId },
  });
  return res.data;
  // const url = `${apiUrl}/uploaded-dataset/uploaded-dataset-log`;
  // const res = await axios.get(url, {
  //   params: { datasetId: datasetId },
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // });
  // return res;
};

export const approveUploadedDatasetAuthenticated = async (
  token: String,
  datasetId: string,
  comment?: string
) => {
  const url = `${apiUrl}/uploaded-dataset/approve`;
  const res = await axios.post(
    url,
    { comment: comment },
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
  comment?: string
) => {
  const url = `${apiUrl}/uploaded-dataset/reject`;
  const res = await axios.post(
    url,
    { comment: comment },
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
  comment?: string
) => {
  const url = `${apiUrl}/uploaded-dataset/review/`;
  const res = await axios.post(
    url,
    { comment: comment },
    {
      params: { id: datasetId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
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
  /*const res = await axios.get(
    `${apiUrl}ingest/downloadTemplate?type=${dataType}&source=${dataSource}`
  );
  return download(res.data, `${dataSource}_${dataType}_template.csv`);*/
  const res = await axios.get(
    `${apiUrl}ingest/downloadTemplate?type=${dataType}&source=${dataSource}`
  );
  return download(res.data, 'va_template.csv');
};

export const downloadRawDatasetFile = async (datasetId: string) => {
  const res = await axios.get(
    `${apiUrl}uploaded-dataset/downloadRaw?id=${datasetId}`
  );
  return download(res.data, `${datasetId}-dataset`);
};

export const downloadConvertedDatasetFile = async (datasetId: string) => {
  const res = await axios.get(
    `${apiUrl}uploaded-dataset/downloadConverted?id=${datasetId}`
  );
  return download(res.data, `${datasetId}-dataset`);
};

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

export const postDataFileAuthenticated = async (
  file: File,
  token: String,
  title: String,
  description: String,
  country: String,
  region: String,
  dataType?: String,
  dataSource?: String,
  datasetId?: String,
  doi?: String,
  generateDoi?: Boolean,
) => {
  const formData = new FormData();
  formData.append('file', file);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  //let url = `${apiUrl}ingest/upload?dataSource=${dataSource}&dataType=${dataType}`;
  let url = `${apiUrl}dataset/upload?dataSource=${dataSource}&dataType=${dataType}`;
  if (datasetId) {
    url = `${url}&datasetId=${datasetId}`;
  }
  if (doi) {
    url = `${url}&doi=${doi}`;
  }
  url = `${url}&title=${title}`;
  if (description) {
    url = `${url}&description=${description}`;
  }
  url = `${url}&country=${country}`;
  url = `${url}&region=${region}`;
  url = `${url}&generateDoi=${generateDoi}`;
  const res = await axios.post(url, formData, config);
  return res.data;
};

export const getDatasetData = async (datasetId: string) => {
  const url = `${apiUrl}dataset/${datasetId}`;
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
