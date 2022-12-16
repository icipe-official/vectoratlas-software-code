import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGraphQlData } from '../../../api/api';
import { occurrenceQuery } from '../../../api/queries';
import { MapState, startNewSearch, updateOccurrence } from '../mapSlice';
import { singularOutputs } from '../utils/singularOutputs';

export const getOccurrenceData = createAsyncThunk(
  'map/getOccurrenceData',
  async (filters: MapState['filters'], thunkAPI) => {
    const numberOfItemsPerResponse = 100;
    const response = await fetchGraphQlData(
      occurrenceQuery(0, numberOfItemsPerResponse, singularOutputs(filters))
    );

    var siteLocations = response.data.OccurrenceData.items;
    var hasMore = response.data.OccurrenceData.hasMore;
    var responseNumber = numberOfItemsPerResponse;

    const searchID = 'id' + Math.random().toString(16).slice(2);
    thunkAPI.dispatch(startNewSearch(searchID));
    thunkAPI.dispatch(updateOccurrence({ data: siteLocations, searchID }));
    while (hasMore === true) {
      const anotherResponse = await fetchGraphQlData(
        occurrenceQuery(
          responseNumber,
          numberOfItemsPerResponse,
          singularOutputs(filters)
        )
      );
      const moreSiteLocations = anotherResponse.data.OccurrenceData.items;
      thunkAPI.dispatch(
        updateOccurrence({
          data: [...siteLocations, ...moreSiteLocations],
          searchID,
        })
      );
      siteLocations = [...siteLocations, ...moreSiteLocations];
      hasMore = anotherResponse.data.OccurrenceData.hasMore;
      responseNumber += numberOfItemsPerResponse;
    }
  }
);
