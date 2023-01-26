import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGraphQlData } from '../../../api/api';
import { getAnalyticsEvents } from '../../../api/queries';
import { updateEvents } from '../homeSlice';

export const getEvents = createAsyncThunk(
  'home/getEvents',
  async (_, thunkAPI) => {
    const response = await fetchGraphQlData(getAnalyticsEvents(0,1674666112277, 'hour', 'Europe%2FLondon'));
    const data = response.data;
    const exploreEvents = data.getAnalyticsEvents.filter((event:any) =>event.x === 'explore-data-button')
    thunkAPI.dispatch(updateEvents(exploreEvents.length));
  }
);
