import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { map } from 'leaflet';
import { fetchApiJson } from '../api/api';

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

  map_drawer: {
    open: boolean,
    overlays: boolean,
    baseMap: boolean,
  }
}

export const initialState: MapState = {
  map_styles: {layers:[]},
  map_overlays: [],
  map_drawer: { open: false, overlays: false, baseMap: false, }
};

export const getMapStyles = createAsyncThunk(
  'map/getMapStyles',
  async () => {
    const mapStyles = await fetchApiJson('config/map-styles');
    return mapStyles;
  }
);

export const getTileServerOverlays = createAsyncThunk(
  'map/getTileServerOverlays',
  async () => {
    const tileServerOverlays = await fetchApiJson('config/tile-server-overlays');
    return tileServerOverlays;
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
      });

  },
});

export const {
  drawerToggle,
  drawerListToggle
} = mapSlice.actions;

export default mapSlice.reducer;
