import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGraphQlData } from '../../../api/api';
import { occurrenceQuery } from '../../../api/queries';
import {
  MapState,
  startNewSearch,
  updateOccurrence,
  setOccurrenceLoading,
} from '../mapSlice';

export const getOccurrenceData = createAsyncThunk(
  'map/getOccurrenceData',
  async (filters: MapState['filters'], thunkAPI) => {
    const numberOfItemsPerResponse = 1000;
    thunkAPI.dispatch(setOccurrenceLoading(true));

    const response = await fetchGraphQlData(
      occurrenceQuery(0, numberOfItemsPerResponse, filters)
    );

    let allSiteLocations = response.data.OccurrenceData.items;
    let hasMore = response.data.OccurrenceData.hasMore;
    let responseNumber = numberOfItemsPerResponse;

    const searchID = 'id' + Math.random().toString(16).slice(2);
    thunkAPI.dispatch(startNewSearch(searchID));

    // Accumulate all data points first to prevent UI flickering and "layout thrashing"
    while (hasMore === true) {
      const anotherResponse = await fetchGraphQlData(
        occurrenceQuery(responseNumber, numberOfItemsPerResponse, filters)
      );
      allSiteLocations = [
        ...allSiteLocations,
        ...anotherResponse.data.OccurrenceData.items,
      ];
      hasMore = anotherResponse.data.OccurrenceData.hasMore;
      responseNumber += numberOfItemsPerResponse;
    }

    // Dispatch a single final update
    thunkAPI.dispatch(updateOccurrence({ data: allSiteLocations, searchID }));
    thunkAPI.dispatch(setOccurrenceLoading(false));
  }
);
