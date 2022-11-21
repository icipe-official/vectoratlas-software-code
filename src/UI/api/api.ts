import axios from 'axios';
import download from 'js-file-download';

const protectedUrl = '/api/protected/';
const apiUrl = '/vector-api/';
const graphQlUrl = '/vector-api/graphql/';

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
