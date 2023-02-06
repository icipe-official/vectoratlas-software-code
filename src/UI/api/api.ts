import axios from 'axios';
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
  dataType: String,
  dataSource: String,
  datasetId?: String
) => {
  const formData = new FormData();
  formData.append('file', file);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  let url = `${apiUrl}ingest/upload?dataSource=${dataSource}&dataType=${dataType}`;
  if (datasetId) {
    url = `${url}&datasetId=${datasetId}`;
  }
  const res = await axios.post(url, formData, config);
  return res.data;
};

export const postDataFileValidated = async (
  file: File,
  token: String,
  dataType: String,
  dataSource: String
) => {
  const formData = new FormData();
  formData.append('file', file);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  let url = `${apiUrl}validation/validateUpload?dataSource=${dataSource}&dataType=${dataType}`;
  const res = await axios.post(url, formData, config);
  return res.data;
};
