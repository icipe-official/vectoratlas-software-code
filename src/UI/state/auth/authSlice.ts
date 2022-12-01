import { createSlice } from '@reduxjs/toolkit';
import { getUserInfo } from './actions/getUserInfo';

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

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserInfo.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getUserInfo.fulfilled, (state, action: any) => {
      state.roles = action.payload.roles;
      state.token = action.payload.token;
      state.isLoading = false;
    });
  },
});

export default authSlice.reducer;
