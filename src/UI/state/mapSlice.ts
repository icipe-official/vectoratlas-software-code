import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchGraphQlData,
  fetchMapStyles,
  fetchTileServerOverlays,
} from '../api/api';
import { locationsQuery } from '../api/queries';

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

  site_locations: {
    longitude: number;
    latitude: number;
  }[];
}

export const initialState: MapState = {
  map_styles: { layers: [] },
  map_overlays: [],
  site_locations: [],
};

export const getMapStyles = createAsyncThunk('map/getMapStyles', async () => {
  const mapStyles = await fetchMapStyles();
  return mapStyles;
});

export const getTileServerOverlays = createAsyncThunk(
  'map/getTileServerOverlays',
  async () => {
    const tileServerOverlays = await fetchTileServerOverlays();
    return tileServerOverlays;
  }
);

export const getSiteLocations = createAsyncThunk(
  'map/getSiteLocations',
  async () => {
    const siteLocations = await fetchGraphQlData(locationsQuery);
    return siteLocations;
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
      })
      .addCase(getSiteLocations.fulfilled, (state, action) => {
        state.site_locations = action.payload;
      });
  },
});

export default mapSlice.reducer;
