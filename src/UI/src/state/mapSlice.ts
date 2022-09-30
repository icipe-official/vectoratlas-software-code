import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchApiJson } from '../api/api';

export interface MapState {
  map_styles: {
    layers: {
      name: string;
      fillColor: number[];
      strokeColor: number[];
      strokeWidth: number;
      zIndex: number;
    }[];
  };

  map_overlays: {
    name: string;
    source: string;
    sourceType: string;
    layers: { name: string }[];
  }[];
}

export const initialState: MapState = {
  map_styles: { layers: [] },
  map_overlays: [],
};

export const getMapStyles = createAsyncThunk('map/getMapStyles', async () => {
  const mapStyles = await fetchApiJson('config/map-styles');
  return mapStyles;
});

export const getTileServerOverlays = createAsyncThunk(
  'map/getTileServerOverlays',
  async () => {
    const tileServerOverlays = await fetchApiJson(
      'config/tile-server-overlays'
    );
    return tileServerOverlays;
  }
);

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMapStyles.fulfilled, (state, action) => {
        state.map_styles = action.payload;
      })
      .addCase(getTileServerOverlays.fulfilled, (state, action) => {
        state.map_overlays = action.payload;
      });
  },
});

export default mapSlice.reducer;
