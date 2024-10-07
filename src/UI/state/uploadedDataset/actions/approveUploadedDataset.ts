import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { approveUploadedDatasetAuthenticated } from '../../../api/api';
import { AppState } from '../../store';
import { setLoading } from '../uploadedDatasetSlice';
import { getUploadedDatasetMetadata } from './getUploadedDatasetMetadata';

export const approveUploadedDataset = createAsyncThunk(
  'uploadedDataset/approveUploadedDataset',
  async (
    { datasetId, comment }: { datasetId: string; comment: string },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setLoading(true));
      await approveUploadedDatasetAuthenticated(token, datasetId, comment);
      toast.success('Dataset approved.');
      dispatch(setLoading(false));
      dispatch(getUploadedDatasetMetadata(datasetId));
    } catch (e) {
      toast.error(
        'Something went wrong with dataset approval. Please try again'
      );
      dispatch(setLoading(false));
    }
  }
);
