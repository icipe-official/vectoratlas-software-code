import * as fs from 'fs';
import { createAsyncThunk, createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchGraphQlData,
  fetchMapStyles,
  fetchSpeciesList,
  fetchTileServerOverlays,
} from '../api/api';
import { occurrenceQuery } from '../api/queries';
import { unpackOverlays } from '../components/map/utils/map.utils';

const countryList = [
  'Sudan',
  'Uganda',
  'Mozambique',
  'Senegal',
  'Mali',
  'United Republic of Tanzania',
  'Madagascar',
  'Burkina Faso',
  'Guinea-Bissau',
];

const speciesList = [
  'amharicus',
  'cameroni',
  'concolor',
  'brumpti',
  'stephensi',
  'confusus',
  'fuscicolor',
  'listeri',
];

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
    country: string;
    species: string;
    isLarval: boolean | undefined;
    isAdult: boolean | undefined;
    isControl: boolean | undefined;
    season: string;
    startTimestamp: number;
    endTimestamp: number;
  };

  set_filters: {
    setCountry: boolean;
    setSpecies: boolean;
    setIsLarval: boolean;
    setIsAdult: boolean;
    setIsControl: boolean;
    setSeason: boolean;
    setTime: boolean;
  };

  filterValues: {
    countries: string[];
    species: string[];
    season: string[];
    isLarval: (string | boolean)[];
    isAdult: (string | boolean)[];
    isControl: (string | boolean)[];
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
    country: '',
    species: '',
    isLarval: undefined,
    isAdult: undefined,
    isControl: undefined,
    season: '',
    startTimestamp: new Date().getTime(),
    endTimestamp: new Date().getTime(),
  },
  set_filters: {
    setCountry: false,
    setSpecies: false,
    setIsLarval: false,
    setIsAdult: false,
    setIsControl: false,
    setSeason: false,
    setTime: false,
  },
  filterValues: {
    countries: countryList,
    species: speciesList,
    season: ['wet', 'dry', 'empty'],
    isLarval: [true, false, 'empty'],
    isAdult: [true, false, 'empty'],
    isControl: [true, false, 'empty'],
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
  async (filters: MapState['filters'], thunkAPI) => {
    const numberOfItemsPerResponse = 100;
    const response = await fetchGraphQlData(
      occurrenceQuery(0, numberOfItemsPerResponse, filters)
    );
    var siteLocations = response.data.OccurrenceData.items;
    var hasMore = response.data.OccurrenceData.hasMore;
    var responseNumber = numberOfItemsPerResponse;
    thunkAPI.dispatch(updateOccurrence(siteLocations));
    while (hasMore === true) {
      const anotherResponse = await fetchGraphQlData(
        occurrenceQuery(responseNumber, numberOfItemsPerResponse, filters)
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
      state.set_filters[action.payload] = !state.set_filters[action.payload];
    },
    filterHandler(state: any, action) {
      state.filters[action.payload.filterName] = action.payload.filterOptions;
      console.log(current(state.filters));
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
  filterHandler
} = mapSlice.actions;
export default mapSlice.reducer;
