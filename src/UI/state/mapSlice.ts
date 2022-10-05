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

  occurrence_data: {
    items: [{}];
    total: number;
    hasMore: boolean;
  }[];
}

export const initialState: MapState = {
  map_styles: { layers: [] },
  map_overlays: [],
  occurrence_data: [],
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

//Get occurrence results
export const getFirstPage = createAsyncThunk(
  'map/getSiteLocations',
  async (_: void, thunkAPI) => {
    const numberOfItemsPerResponse = 100;
    const response = await fetchGraphQlData(
      locationsQuery(0, numberOfItemsPerResponse)
    );
    var siteLocations = response.data.OccurrenceData.items;
    var hasMore = response.data.OccurrenceData.hasMore;
    var responseNumber = numberOfItemsPerResponse;
    thunkAPI.dispatch(updateOccurrence(siteLocations));
    while (hasMore === true) {
      const anotherResponse = await fetchGraphQlData(
        locationsQuery(responseNumber, numberOfItemsPerResponse)
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

export default mapSlice.reducer;
export const { updateOccurrence } = mapSlice.actions;
