import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  fetchLocalVersion,
  fetchApiVersion,
  fetchFeatureFlags,
  fetchAllData,
} from '../api/api';

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

export const getAllData = createAsyncThunk('export/getAllData', async () => {
  const allData: any = await fetchAllData().catch((e) => {
    toast.error(
      'Oops! Something went wrong - Check the console for further details'
    );
    console.log(e);
    return allData;
  });
  toast.success('Download Successful', {
    position: 'bottom-left',
    closeOnClick: true,
    autoClose: 2000,
    progress: undefined,
    theme: 'dark',
  });
  return allData;
});

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
      .addCase(getAllData.pending, (state) => {
        state.download_all_status = 'loading';
      })
      .addCase(getAllData.rejected, (state) => {
        state.download_all_status = 'error';
      });
  },
});

export default configSlice.reducer;
