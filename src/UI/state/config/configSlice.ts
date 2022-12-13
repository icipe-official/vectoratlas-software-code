import { createSlice } from '@reduxjs/toolkit';
import { getAllData } from './actions/getAllData';
import { getApiVersion } from './actions/getApiVersion';
import { getFeatureFlags } from './actions/getFeatureFlags';
import { getUiVersion } from './actions/getUiVersion';

export interface ConfigState {
  version_ui: string;
  version_api: string;
  feature_flags_status: string;
  download_all_status: string;
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
  download_all_status: '',
};

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
      })
      .addCase(getAllData.fulfilled, (state) => {
        state.download_all_status = 'success';
      })
      .addCase(getAllData.rejected, (state) => {
        state.download_all_status = 'error';
      });
  },
});

export default configSlice.reducer;
