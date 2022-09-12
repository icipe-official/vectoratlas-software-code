import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchLocalText, fetchApiText, fetchApiJson } from '../api/api';

export interface ConfigState {
  version_ui: string
  version_api: string
  feature_flags_status: string
  feature_flags: {
    flag: string,
    on: boolean
  }[]
  
  map_styles: {
    layers: {
      name:string,
      fillColor:number[],
      strokeColor:number[],
      strokeWidth: number,
      zIndex: number
    }[]
  }

  map_overlays: {
      name: string,
      source: string
  }[]
}

export const initialState: ConfigState = {
  version_ui: 'local_ui',
  version_api: 'local_api',
  feature_flags: [],
  feature_flags_status: '',
  map_styles: {layers:[]},
  map_overlays: []
};

export const getUiVersion = createAsyncThunk(
  'config/getUiVersion',
  async () => {
    const version = await fetchLocalText('version.txt');
    return version;
  }
);

export const getApiVersion = createAsyncThunk(
  'config/getApiVersion',
  async () => {
    const version = await fetchApiText('config/version');
    return version;
  }
);

export const getFeatureFlags = createAsyncThunk(
  'config/getFeatureFlags',
  async () => {
    const featureFlags = await fetchApiJson('config/featureFlags');
    return featureFlags;
  }
);

export const getMapStyles = createAsyncThunk(
  'config/getMapStyles',
  async () => {
    const mapStyles = await fetchApiJson('config/map-styles');
    return mapStyles;
  }
);

export const getTileServerOverlays = createAsyncThunk(
  'config/getTileServerOverlays',
  async () => {
    const tileServerOverlays = await fetchApiJson('config/tile-server-overlays');
    return tileServerOverlays;
  }
);

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
  },
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
      .addCase(getMapStyles.fulfilled, (state, action) => {
        state.map_styles = action.payload;
      })
      .addCase(getTileServerOverlays.fulfilled, (state, action) => {
        state.map_overlays = action.payload;
      });

  },
});

export default configSlice.reducer;
