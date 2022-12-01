import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTileServerOverlays } from '../../../api/api';

export const getTileServerOverlays = createAsyncThunk(
  'map/getTileServerOverlays',
  async () => {
    const tileServerOverlays = await fetchTileServerOverlays();
    return tileServerOverlays;
  }
);
