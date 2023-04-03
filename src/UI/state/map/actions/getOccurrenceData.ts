import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGraphQlData } from '../../../api/api';
import { occurrenceQuery } from '../../../api/queries';
import { MapState, startNewSearch, updateOccurrence } from '../mapSlice';

export const getOccurrenceData = createAsyncThunk(
  'map/getOccurrenceData',
  async (filters: MapState['filters'], thunkAPI) => {
    const numberOfItemsPerResponse = 1000;
    console.log(1, new Date());
    const response = await fetchGraphQlData(
      occurrenceQuery(0, numberOfItemsPerResponse, filters)
    );
    console.log(2, new Date());

    var siteLocations = response.data.OccurrenceData.items;
    var hasMore = response.data.OccurrenceData.hasMore;
    var responseNumber = numberOfItemsPerResponse;

    const searchID = 'id' + Math.random().toString(16).slice(2);
    thunkAPI.dispatch(startNewSearch(searchID));
    thunkAPI.dispatch(updateOccurrence({ data: siteLocations, searchID }));
    while (hasMore === true) {
      console.log(3, new Date());
      const anotherResponse = await fetchGraphQlData(
        occurrenceQuery(responseNumber, numberOfItemsPerResponse, filters)
      );
      console.log(4, new Date());
      const moreSiteLocations = anotherResponse.data.OccurrenceData.items;
      thunkAPI.dispatch(
        updateOccurrence({
          data: [...siteLocations, ...moreSiteLocations],
          searchID,
        })
      );
      console.log(5, new Date());
      siteLocations = [...siteLocations, ...moreSiteLocations];
      hasMore = anotherResponse.data.OccurrenceData.hasMore;
      responseNumber += numberOfItemsPerResponse;
    }
  }
);
