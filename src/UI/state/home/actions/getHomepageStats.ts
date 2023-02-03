import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGraphQlData } from '../../../api/api';
import { getHomepageAnalytics } from '../../../api/queries';
import { updateStats, serverValidation } from '../homeSlice';

const date = new Date();

export const getHomepageStats = createAsyncThunk(
  'home/getHomepageStats',
  async (_, thunkAPI) => {
    try {
      const response = await fetchGraphQlData(
        getHomepageAnalytics(0, date.getTime(), 'hour', 'Europe%2FLondon')
      );
      const data = response.data.getHomepageAnalytics;
      thunkAPI.dispatch(serverValidation(true));
      thunkAPI.dispatch(updateStats(data));
    } catch (e: any) {
      console.log(e.message);
      thunkAPI.dispatch(serverValidation(false));
    }
  }
);
