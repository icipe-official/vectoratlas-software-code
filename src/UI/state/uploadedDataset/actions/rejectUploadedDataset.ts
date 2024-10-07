import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { rejectUploadedDatasetAuthenticated } from '../../../api/api';
import { AppState } from '../../store';
import { setLoading } from '../uploadedDatasetSlice';
import { getUploadedDatasetMetadata } from './getUploadedDatasetMetadata';

export const rejectUploadedDataset = createAsyncThunk(
  'uploadedDataset/rejectUploadedDataset',
  async (
    { datasetId, comment }: { datasetId: string; comment: string },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setLoading(true));
      await rejectUploadedDatasetAuthenticated(token, datasetId, comment);
      toast.success('Dataset rejected');
      dispatch(setLoading(false));
      dispatch(getUploadedDatasetMetadata(datasetId));
    } catch (e) {
      toast.error(
        'Something went wrong with rejecting dataset. Please try again'
      );
      dispatch(setLoading(false));
    }
  }
);
