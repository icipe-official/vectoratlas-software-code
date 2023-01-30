import { createAsyncThunk } from '@reduxjs/toolkit';

export const downloadDatasetData = createAsyncThunk(
  'review/downloadDatasetData',
  async (
    datasetId: string
  ) => {
    console.log(`Download dataset ${datasetId}`)
  }
);
