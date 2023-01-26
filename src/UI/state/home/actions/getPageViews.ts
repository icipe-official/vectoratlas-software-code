import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGraphQlData } from '../../../api/api';
import { getAnalyticsStats } from '../../../api/queries';
import { updatePageViews } from '../homeSlice';

export const getPageViews= createAsyncThunk(
  'home/getPageViews',
  async (_, thunkAPI) => {
    const response = await fetchGraphQlData(getAnalyticsStats(0,1674666112277));
    const data = response.data;
    const pageViews = data.getAnalyticsStats.pageviews.value
    thunkAPI.dispatch(updatePageViews(pageViews));
  }
);
