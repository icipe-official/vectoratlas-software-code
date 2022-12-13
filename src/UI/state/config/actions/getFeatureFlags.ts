import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFeatureFlags } from '../../../api/api';

export const getFeatureFlags = createAsyncThunk(
  'config/getFeatureFlags',
  async () => {
    const featureFlags = await fetchFeatureFlags();
    return featureFlags;
  }
);
