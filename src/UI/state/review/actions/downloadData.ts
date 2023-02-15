import { createAsyncThunk } from '@reduxjs/toolkit';
import { getDatasetData } from '../../../api/api';
import { setLoading } from '../reviewSlice';

export const downloadDatasetData = createAsyncThunk(
  'review/downloadDatasetData',
  async ({ datasetId }: { datasetId: string }, { dispatch }) => {
    dispatch(setLoading(true));
    await getDatasetData(datasetId)
  }
);
