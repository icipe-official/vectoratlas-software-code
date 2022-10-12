import React from 'react';
import NotUploader from '../components/shared/Notauthenticated';
import Upform from '../components/upload/Upform';
import { useAppSelector } from '../state/hooks';

function Upload() {
  const role = useAppSelector((state) => state.auth.roles);

  return role.includes('uploader') ? <Upform /> : <NotUploader name="uploader" />

}

export default Upload;
