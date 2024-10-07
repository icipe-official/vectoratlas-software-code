import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setLoading,
  setUploadedDatasetMetadata,
} from '../uploadedDatasetSlice';
import { fetchGraphQlData } from '../../../api/api';
import { uploadedDatasetById } from '../../../api/queries';

export const getUploadedDatasetMetadata = createAsyncThunk(
  'uploadedDataset/getUploadedDatasetMetadata',
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true));
    let res = await fetchGraphQlData(uploadedDatasetById(id));

    dispatch(setUploadedDatasetMetadata(res.data.uploadedDatasetById));
    dispatch(setLoading(false));
  }
);
