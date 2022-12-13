import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGraphQlData } from '../../../api/api';
import { fullOccurrenceQuery } from '../../../api/queries';
import { AppState } from '../../store';
import { updateSelectedData } from '../mapSlice';

export const getFullOccurrenceData = createAsyncThunk(
  'map/getFullOccurrenceData',
  async (_, thunkAPI) => {
    const selectedIds = (thunkAPI.getState() as AppState).map.selectedIds;
    const response = await fetchGraphQlData(fullOccurrenceQuery(selectedIds));
    const data = response.data.FullOccurrenceData;
    thunkAPI.dispatch(updateSelectedData(data));
  }
);
