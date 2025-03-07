import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAuth } from '../../../api/api';
import * as njwt from 'njwt';

export const getUserInfo = createAsyncThunk('auth/getUserInfo', async () => {
  debugger;
  console.log('Getting user info');
  const token = await fetchAuth();
  console.log('Retrieved token: ', token);
  const verifiedToken: any = njwt.verify(
    token,
    process.env.NEXT_PUBLIC_TOKEN_KEY
  );
  console.log('Verified token: ', token);
  return {
    sub: verifiedToken?.body.sub,
    token: token,
    // roles: ['uploader', 'admin', 'editor', 'reviewer', 'reviewer-manager'], // verifiedToken?.body.scope.split(','),
    roles: verifiedToken?.body.scope.split(','),
  };
});
