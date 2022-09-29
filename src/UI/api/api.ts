import { locationsQuery } from './queries/locationsQuery';

export const fetchLocalText = async (filename: string) => {
  const res = await fetch(`/${filename}`);
  const text = await res.text();
  return text;
};

export const fetchApiText = async (url: string) => {
  const res = await fetch(`/vector-api/${url}`);
  const text = await res.text();
  return text;
};

export const fetchApiJson = async (url: string) => {
  const res = await fetch(`/vector-api/${url}`);
  const json = await res.json();
  return json;
};

export const fetchProtectedApiJson = async (url: string) => {
  const res = await fetch(`/api/protected/${url}`);
  const json = await res.json();
  return json;
};

export const fetchApiPost = async (url:string) => {
  const data = await fetch(`/vector-api/${url}`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({query:locationsQuery})
  }).then(response => response.json());
  return data;
};
