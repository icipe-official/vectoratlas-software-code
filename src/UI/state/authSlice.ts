import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as njwt from 'njwt';
import { fetchAuth } from '../api/api';

export interface AuthState {
  roles: String[];
  token: String;
  isLoading: Boolean;
}

export const initialState: AuthState = {
  roles: [],
  token: '',
  isLoading: true,
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
    builder.addCase(getUserInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserInfo.fulfilled, (state, action: any) => {
      state.roles = action.payload.roles;
      state.token = action.payload.token;
      state.isLoading = false;
    });
  },
});

export default authSlice.reducer;
