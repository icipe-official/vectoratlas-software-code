import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGraphQlData } from '../../../api/api';
import { datasetById } from '../../../api/queries';
import { setDatasetMetadata } from '../reviewSlice';

export const getDatasetMetadata = createAsyncThunk(
  'review/getDatasetMetadata',
  async (id: string, { dispatch }) => {
    let res = await fetchGraphQlData(datasetById(id));

    dispatch(setDatasetMetadata(res.data.datasetById));
  }
);
