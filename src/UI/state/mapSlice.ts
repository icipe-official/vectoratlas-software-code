import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchGraphQlData,
  fetchMapStyles,
  fetchSpeciesList,
  fetchTileServerOverlays,
} from '../api/api';
import { occurrenceQuery } from '../api/queries';
import { unpackOverlays } from '../components/map/utils/map.utils';

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
    sourceLayer: string;
    sourceType: string;
    isVisible: boolean;
  }[];

  occurrence_data: {
    items: [{}];
    total: number;
    hasMore: boolean;
  }[];

  map_drawer: {
    open: boolean;
    overlays: boolean;
    baseMap: boolean;
    filters: boolean;
  };

  filters: {
    setCountry: boolean;
    country: string[];
    setSpecies: boolean;
    species: string[];
    setIsLarval: boolean;
    isLarval: boolean[];
    setIsAdult: boolean;
    isAdult: boolean[];
    setIsControl: boolean;
    isControl: boolean[];
    setSeason: boolean;
    seasons: string[];
    setTime: boolean;
    startTimestampRange: { min: GLfloat; max: GLfloat };
    endTimestampRange: { min: GLfloat; max: GLfloat };
  };

  species_list: { series: string; color: number[] }[];
}

export const initialState: MapState = {
  map_styles: { layers: [] },
  map_overlays: [],
  occurrence_data: [],
  map_drawer: { open: false, overlays: false, baseMap: false, filters: false },
  species_list: [],
  filters: {
    setCountry: false,
    country: ['Country1', 'Country2', 'Country3'],
    setSpecies: false,
    species: ['concolor', 'ovengens', 'quadriannulatus'],
    setIsLarval: false,
    isLarval: [true, false],
    setIsAdult: false,
    isAdult: [true, false],
    setIsControl: false,
    isControl: [true, false],
    setSeason: false,
    seasons: ['dry', 'wet', 'cross'],
    setTime: false,
    startTimestampRange: { min: 1997, max: 2001 },
    endTimestampRange: { min: 1997, max: 2006 },
  },
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

export const getSpeciesList = createAsyncThunk(
  'map/getSpeciesList',
  async () => {
    const speciesList = await fetchSpeciesList();
    return speciesList.data;
  }
);

//Get occurrence results
export const getOccurrenceData = createAsyncThunk(
  'map/getOccurrenceData',
  async (_: void, thunkAPI) => {
    const numberOfItemsPerResponse = 100;
    const response = await fetchGraphQlData(
      occurrenceQuery(0, numberOfItemsPerResponse)
    );
    var siteLocations = response.data.OccurrenceData.items;
    var hasMore = response.data.OccurrenceData.hasMore;
    var responseNumber = numberOfItemsPerResponse;
    thunkAPI.dispatch(updateOccurrence(siteLocations));
    while (hasMore === true) {
      const anotherResponse = await fetchGraphQlData(
        occurrenceQuery(responseNumber, numberOfItemsPerResponse)
      );
      const moreSiteLocations = anotherResponse.data.OccurrenceData.items;
      thunkAPI.dispatch(
        updateOccurrence([...siteLocations, ...moreSiteLocations])
      );
      siteLocations = [...siteLocations, ...moreSiteLocations];
      hasMore = anotherResponse.data.OccurrenceData.hasMore;
      responseNumber += numberOfItemsPerResponse;
    }
  }
);

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    updateOccurrence(state, action) {
      state.occurrence_data = action.payload;
    },
    drawerToggle(state) {
      const map_drawer = state.map_drawer;
      if (state.map_drawer.open === true) {
        map_drawer.open = false;
        map_drawer.overlays = false;
        map_drawer.baseMap = false;
        map_drawer.filters = false;
      } else {
        map_drawer.open = true;
      }
    },
    drawerListToggle(state, action: PayloadAction<string>) {
      action.payload === 'overlays'
        ? (state.map_drawer.overlays = !state.map_drawer.overlays)
        : action.payload === 'baseMap'
        ? (state.map_drawer.baseMap = !state.map_drawer.baseMap)
        : (state.map_drawer.filters = !state.map_drawer.filters);
    },
    layerToggle(state, action: PayloadAction<string>) {
      const map_overlays = state.map_overlays;
      const currentVis = map_overlays.find(
        (l: any) => l.name === action.payload
      )?.isVisible;
      state.map_overlays = map_overlays.map((l: any) =>
        l.name === action.payload ? { ...l, isVisible: !currentVis } : l
      );
    },
    activeFilterToggle(state: any, action: PayloadAction<string>) {
      state.filters[action.payload] = !state.filters[action.payload];
      console.log(action.payload, 'mapSlice');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMapStyles.fulfilled, (state, action) => {
        state.map_styles = action.payload;
      })
      .addCase(getTileServerOverlays.fulfilled, (state, action) => {
        state.map_overlays = unpackOverlays(action.payload);
      })
      .addCase(getSpeciesList.fulfilled, (state, action) => {
        state.species_list = action.payload;
      });
  },
});

export const {
  updateOccurrence,
  drawerToggle,
  drawerListToggle,
  layerToggle,
  activeFilterToggle,
} = mapSlice.actions;
export default mapSlice.reducer;
