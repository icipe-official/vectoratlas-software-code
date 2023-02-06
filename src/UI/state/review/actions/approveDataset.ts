import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from '../../store';

export const approveDataset = createAsyncThunk(
  'review/approveDataset',
  async (
    {
      datasetId,
    }: { datasetId?: String; },
    { getState, dispatch }) => {

    const token = (getState() as AppState).auth.token;

  }
);
