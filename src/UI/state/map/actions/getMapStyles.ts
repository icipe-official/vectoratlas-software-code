import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMapStyles } from '../../../api/api';

export const getMapStyles = createAsyncThunk('map/getMapStyles', async () => {
  const mapStyles = await fetchMapStyles();
  return mapStyles;
});
