import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProtectedApiJson } from "../api/api";

export interface AuthState {
  username: String,
  roles: []
}

export const initialState: AuthState = {
  username: '',
  roles: []
}

export const getUserInfo = createAsyncThunk(
  'auth/getUserInfo',
  async (user: any) => {
    console.log(user);
    if (!user) {
      const token = await fetchProtectedApiJson('/auth');
      console.log(token)
    }
    return user?.nickname ?? '';
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.username = action.payload;
      })
  },
});

export default authSlice.reducer;
