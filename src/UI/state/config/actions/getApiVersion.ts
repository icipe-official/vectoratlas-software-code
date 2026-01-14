import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchApiVersion } from '../../../api/api';

export const getApiVersion = createAsyncThunk(
  'config/getApiVersion',
  async () => {
    const version = await fetchApiVersion();
    return version;
  }
);
