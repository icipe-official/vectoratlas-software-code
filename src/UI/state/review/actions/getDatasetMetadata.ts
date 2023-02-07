import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGraphQlData } from '../../../api/api';
import { datasetById } from '../../../api/queries';
import { setDatasetMetadata, setLoading } from '../reviewSlice';

export const getDatasetMetadata = createAsyncThunk(
  'review/getDatasetMetadata',
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true))
    let res = await fetchGraphQlData(datasetById(id));

    dispatch(setDatasetMetadata(res.data.datasetById));
    dispatch(setLoading(false))
  }
);
