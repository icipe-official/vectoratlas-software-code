import { createSlice } from '@reduxjs/toolkit';

export interface ReviewState {
  datasetMetadata: {
    UpdatedBy: string;
    UpdatedAt: string;
  };
}

export const initialState: () => ReviewState = () => ({
  datasetMetadata: {
    UpdatedBy: '',
    UpdatedAt: '',
  },
});

export const reviewSlice = createSlice({
  name: 'review',
  initialState: initialState(),
  reducers: {
    setDatasetMetadata(state, action) {
      state.datasetMetadata = action.payload;
    },
  },
});

export const { setDatasetMetadata } = reviewSlice.actions;

export default reviewSlice.reducer;
