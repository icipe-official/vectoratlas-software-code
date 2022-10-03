import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchLocalVersion,
  fetchApiVersion,
  fetchFeatureFlags,
} from '../api/api';

export interface ConfigState {
  version_ui: string;
  version_api: string;
  feature_flags_status: string;
  feature_flags: {
    flag: string;
    on: boolean;
  }[];
}

export const initialState: ConfigState = {
  version_ui: 'local_ui',
  version_api: 'local_api',
  feature_flags: [],
  feature_flags_status: '',
};

export const getUiVersion = createAsyncThunk(
  'config/getUiVersion',
  async () => {
    const version = await fetchLocalVersion();
    return version;
  }
);

export const getApiVersion = createAsyncThunk(
  'config/getApiVersion',
  async () => {
    const version = await fetchApiVersion();
    return version;
  }
);

export const getFeatureFlags = createAsyncThunk(
  'config/getFeatureFlags',
  async () => {
    const featureFlags = await fetchFeatureFlags();
    return featureFlags;
  }
);

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUiVersion.pending, (state) => {
        state.version_ui = 'loading';
      })
      .addCase(getUiVersion.rejected, (state) => {
        state.version_ui = 'error';
      })
      .addCase(getUiVersion.fulfilled, (state, action) => {
        state.version_ui = action.payload;
      })
      .addCase(getApiVersion.pending, (state) => {
        state.version_api = 'loading';
      })
      .addCase(getApiVersion.rejected, (state) => {
        state.version_api = 'error';
      })
      .addCase(getApiVersion.fulfilled, (state, action) => {
        state.version_api = action.payload;
      })
      .addCase(getFeatureFlags.pending, (state) => {
        state.feature_flags_status = 'loading';
      })
      .addCase(getFeatureFlags.rejected, (state) => {
        state.feature_flags_status = 'error';
      })
      .addCase(getFeatureFlags.fulfilled, (state, action) => {
        state.feature_flags_status = 'success';
        state.feature_flags = action.payload;
      });
  },
});

export default configSlice.reducer;
