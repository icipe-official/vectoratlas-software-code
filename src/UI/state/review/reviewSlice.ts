import { createSlice } from '@reduxjs/toolkit';

export interface ReviewState {
  datasetMetadata: {
    UploadedBy: string,
    UploadedAt: string
  }
}

export const initialState: () => ReviewState = () => ({
  datasetMetadata: {
    UpdatedBy: '',
    UpdatedAt: ''
  }
});

export const reviewSlice = createSlice({
  name: 'upload',
  initialState: initialState(),
  reducers: {
    setDatasetMetadata(state, action) {
      state.datasetMetadata = action.payload;
    },
  },
});

export const { setDatasetMetadata } = reviewSlice.actions;

export default reviewSlice.reducer;
