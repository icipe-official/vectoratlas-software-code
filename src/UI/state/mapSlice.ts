import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchGraphQlData,
  fetchMapStyles,
  fetchSpeciesList,
  fetchTileServerOverlays,
} from '../api/api';
import { occurrenceQuery } from '../api/queries';

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

  occurrence_data: {
    items: [{}];
    total: number;
    hasMore: boolean;
  }[];

  map_drawer: {
    open: boolean;
    overlays: boolean;
    baseMap: boolean;
  };

  species_list: { series: string; color: number[] }[];
}

export const initialState: MapState = {
  map_styles: { layers: [] },
  map_overlays: [],
  occurrence_data: [],
  map_drawer: { open: false, overlays: false, baseMap: false },
  species_list: [],
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
      } else {
        map_drawer.open = true;
      }
    },

    drawerListToggle(state, action: PayloadAction<String>) {
      action.payload === 'overlays'
        ? (state.map_drawer.overlays = !state.map_drawer.overlays)
        : (state.map_drawer.baseMap = !state.map_drawer.baseMap);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMapStyles.fulfilled, (state, action) => {
        state.map_styles = action.payload;
      })
      .addCase(getTileServerOverlays.fulfilled, (state, action) => {
        state.map_overlays = action.payload;
      })
      .addCase(getSpeciesList.fulfilled, (state, action) => {
        state.species_list = action.payload;
      });
  },
});

export const { updateOccurrence, drawerToggle, drawerListToggle } =
  mapSlice.actions;
export default mapSlice.reducer;
