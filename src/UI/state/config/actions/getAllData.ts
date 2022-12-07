import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllData } from '../../../api/api';

export const getAllData = createAsyncThunk('export/getAllData', async () => {
  await fetchAllData();
});
