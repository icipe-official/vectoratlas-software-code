import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGraphQlData } from '../../../api/api';
import { getAnalyticsMetrics } from '../../../api/queries';
import { updateMetrics } from '../homeSlice';

export const getMetrics = createAsyncThunk(
  'home/getMetrics',
  async (_, thunkAPI) => {
    const response = await fetchGraphQlData(getAnalyticsMetrics(0,1674666112277, 'country'));
    const data = response.data;
    // console.log(data)
    const countries = data.getMetricsStats
    // console.log(countries)
    thunkAPI.dispatch(updateMetrics(data));
  }
);
