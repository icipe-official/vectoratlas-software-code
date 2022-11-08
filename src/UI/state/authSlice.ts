import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as njwt from 'njwt';
import { fetchAuth } from '../api/api';

export interface AuthState {
  roles: String[];
  token: String;
}

export const initialState: AuthState = {
  roles: [],
  token: '',
};

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

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.fulfilled, (state, action: any) => {
      state.roles = action.payload.roles;
      state.token = action.payload.token;
    });
  },
});

export default authSlice.reducer;
