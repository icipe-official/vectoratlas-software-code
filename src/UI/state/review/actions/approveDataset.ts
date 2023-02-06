import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { approveDatasetAuthenticated } from '../../../api/api';
import { AppState } from '../../store';
import { setLoading } from '../reviewSlice';

export const approveDataset = createAsyncThunk(
  'review/approveDataset',
  async ({ datasetId }: { datasetId: String }, { getState, dispatch }) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setLoading(true));
      await approveDatasetAuthenticated(token, datasetId);
      toast.success('Dataset approved.');
      dispatch(setLoading(false));
    } catch (e) {
      toast.error(
        'Something went wrong with dataset approval. Please try again.'
      );
      dispatch(setLoading(false));
    }
  }
);
