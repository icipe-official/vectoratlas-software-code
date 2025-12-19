import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGraphQlData } from '../../../api/api';
import { occurrenceQuery } from '../../../api/queries';
import { MapState, startNewSearch, updateOccurrence, setOccurrenceProgress } from '../mapSlice';

export const getOccurrenceData = createAsyncThunk(
  'map/getOccurrenceData',
  async (filters: MapState['filters'], thunkAPI) => {
    const numberOfItemsPerResponse = 1000;
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

    // Estimate total items for progress (if API provides totalCount)
    const totalItems = response.data.OccurrenceData.totalCount ?? (siteLocations.length + (hasMore ? 1000 : 0));
    thunkAPI.dispatch(setOccurrenceProgress(Math.min((siteLocations.length / totalItems) * 100, 100)));

    while (hasMore === true) {
      const anotherResponse = await fetchGraphQlData(
        occurrenceQuery(responseNumber, numberOfItemsPerResponse, filters)
      );

      const moreSiteLocations = anotherResponse.data.OccurrenceData.items;

      // Incrementally update occurrence data
      siteLocations = [...siteLocations, ...moreSiteLocations];
      thunkAPI.dispatch(updateOccurrence({ data: siteLocations, searchID }));

      // Update progress
      const progress = Math.min((siteLocations.length / totalItems) * 100, 100);
      thunkAPI.dispatch(setOccurrenceProgress(progress));

      hasMore = anotherResponse.data.OccurrenceData.hasMore;
      responseNumber += numberOfItemsPerResponse;
    }
  }
);
;
