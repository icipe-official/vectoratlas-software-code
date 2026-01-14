import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchLocalVersion } from '../../../api/api';

export const getUiVersion = createAsyncThunk(
  'config/getUiVersion',
  async () => {
    const version = await fetchLocalVersion();
    return version;
  }
);
