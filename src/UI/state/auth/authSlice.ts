import { createSlice } from '@reduxjs/toolkit';
import { getUserInfo } from './actions/getUserInfo';

export interface AuthState {
  roles: String[];
  token: String;
  isLoading: Boolean;
  roleRequestLoading: boolean;
}

export const initialState: () => AuthState = () => ({
  roles: [],
  token: '',
  isLoading: true,
  roleRequestLoading: false,
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState(),
  reducers: {
    requestLoading(state, action) {
      state.roleRequestLoading = action.payload;
    },
  },
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

export const { requestLoading } = authSlice.actions;

export default authSlice.reducer;
