import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGraphQlData } from '../../../api/api';
import { getHomepageAnalytics } from '../../../api/queries';
import { updateStats, updateLoadingFlag } from '../homeSlice';
import * as logger from '../../../utils/logger';

const date = new Date();

export const getHomepageStats = createAsyncThunk(
  'home/getHomepageStats',
  async (_, thunkAPI) => {
    try {
      const response = await fetchGraphQlData(
        getHomepageAnalytics(0, date.getTime(), 'hour', 'Europe%2FLondon')
      );
      const data = response.data.getHomepageAnalytics;
      thunkAPI.dispatch(updateLoadingFlag(true));
      thunkAPI.dispatch(updateStats(data));
    } catch (e: any) {
      logger.error(e);
      thunkAPI.dispatch(updateLoadingFlag(false));
    }
  }
);
