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

    // Start generic loading
    thunkAPI.dispatch(setOccurrenceLoading(true));

    const response = await fetchGraphQlData(
      occurrenceQuery(0, numberOfItemsPerResponse, filters)
    );

    let siteLocations = response.data.OccurrenceData.items;
    let hasMore = response.data.OccurrenceData.hasMore;
    let responseNumber = numberOfItemsPerResponse;

    // Generate a unique search ID
    const searchID = 'id' + Math.random().toString(16).slice(2);

    // Start new search and initial update
    thunkAPI.dispatch(startNewSearch(searchID));
    thunkAPI.dispatch(updateOccurrence({ data: siteLocations, searchID }));

    // Fetch additional chunks if any
    while (hasMore === true) {
      const anotherResponse = await fetchGraphQlData(
        occurrenceQuery(responseNumber, numberOfItemsPerResponse, filters)
      );

      const moreSiteLocations = anotherResponse.data.OccurrenceData.items;

      // Incrementally update occurrence data
      siteLocations = [...siteLocations, ...moreSiteLocations];
      thunkAPI.dispatch(updateOccurrence({ data: siteLocations, searchID }));

      hasMore = anotherResponse.data.OccurrenceData.hasMore;
      responseNumber += numberOfItemsPerResponse;
    }

    // Stop loading when done
    thunkAPI.dispatch(setOccurrenceLoading(false));
  }
);
