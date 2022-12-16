import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAuth } from '../../../api/api';
import * as njwt from 'njwt';

export const getUserInfo = createAsyncThunk('auth/getUserInfo', async () => {
  const token = await fetchAuth();
  const verifiedToken: any = njwt.verify(
    token,
    process.env.NEXT_PUBLIC_TOKEN_KEY
  );
  return {
    token: token,
    roles: verifiedToken?.body.scope.split(','),
  };
});
