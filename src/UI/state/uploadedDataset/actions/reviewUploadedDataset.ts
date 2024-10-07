import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { reviewUploadedDatasetAuthenticated } from '../../../api/api';
import { AppState } from '../../store';
import { setLoading } from '../uploadedDatasetSlice';
import { getUploadedDatasetMetadata } from './getUploadedDatasetMetadata';

export const reviewUploadedDataset = createAsyncThunk(
  'uploadedDataset/reviewUploadedDataset',
  async (
    { datasetId, comment }: { datasetId: string; comment: string },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setLoading(true));
      await reviewUploadedDatasetAuthenticated(token, datasetId, comment);
      toast.success('Dataset reviewed');
      dispatch(setLoading(false));
      dispatch(getUploadedDatasetMetadata(datasetId));
    } catch (error) {
      toast.error(
        ' Something went wrong when reviewing dataset. Please try again'
      );
      dispatch(setLoading(false));
    }
  }
);
