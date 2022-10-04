import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchGraphQlData, fetchMapStyles, fetchTileServerOverlays } from '../api/api';
import { locationsQuery } from '../api/queries';

export interface MapState {
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
    name: string;
    sourceLayer: string;
    sourceType: string;
    overlays: {name:string}[]
  }[]

  site_locations:{
    longitude: number,
    latitude: number
  }[]

  map_drawer: {
    open: boolean,
    overlays: boolean,
    baseMap: boolean,
  }
}

export const initialState: MapState = {
  map_styles: {layers:[]},
  map_overlays: [],
  site_locations: [],
  map_drawer: { open: false, overlays: false, baseMap: false, }
};

export const getMapStyles = createAsyncThunk(
  'map/getMapStyles',
  async () => {
    const mapStyles = await fetchMapStyles();
    return mapStyles;
  }
);

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
  reducers: {
    drawerToggle(state) {
      const map_drawer = state.map_drawer;
      if (state.map_drawer.open === true) {
        map_drawer.open = false;
        map_drawer.overlays = false;
        map_drawer.baseMap = false;
      }
      else{
        map_drawer.open = true;
      }
    },

    drawerListToggle(state,action: PayloadAction<String>) {
      (action.payload === 'overlays') ? state.map_drawer.overlays = !state.map_drawer.overlays : state.map_drawer.baseMap = !state.map_drawer.baseMap;
    }
  },
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

export const {
  drawerToggle,
  drawerListToggle
} = mapSlice.actions;

export default mapSlice.reducer;
