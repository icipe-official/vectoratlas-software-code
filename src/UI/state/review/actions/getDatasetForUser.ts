import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGraphQlData } from '../../../api/api';
import { datasetsByUser } from '../../../api/queries';
import { setDatasetList, setLoading } from '../reviewSlice';

export const getDatasetForUser = createAsyncThunk(
  'review/getDatasetForUser',
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true));
    let res = await fetchGraphQlData(datasetsByUser(id));

    dispatch(setDatasetList(res.data.datasetsByUser));
    dispatch(setLoading(false));
  }
);