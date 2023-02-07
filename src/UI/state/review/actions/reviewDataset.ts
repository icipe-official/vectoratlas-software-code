import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { reviewDatasetAuthenticated } from '../../../api/api';
import { AppState } from '../../store';
import { setLoading } from '../reviewSlice';
import { getDatasetMetadata } from './getDatasetMetadata';

export const reviewDataset = createAsyncThunk(
  'review/reviewDataset',
  async ({ datasetId, reviewComments }: { datasetId: string, reviewComments: string }, { getState, dispatch }) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setLoading(true));
      await reviewDatasetAuthenticated(token, datasetId, reviewComments);
      toast.success('Comments sent');
      dispatch(setLoading(false));
      dispatch(getDatasetMetadata(datasetId));
    } catch (e) {
      toast.error(
        'Something went wrong with dataset review. Please try again.'
      );
      dispatch(setLoading(false));
    }
  }
);
