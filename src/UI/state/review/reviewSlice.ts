import { createSlice } from '@reduxjs/toolkit';

export interface ReviewState {
  datasetMetadata: {
    UpdatedBy: string;
    UpdatedAt: string;
  };
  loading: boolean;
}

export const initialState: () => ReviewState = () => ({
  datasetMetadata: {
    UpdatedBy: '',
    UpdatedAt: '',
  },
  loading: false,
});

export const reviewSlice = createSlice({
  name: 'review',
  initialState: initialState(),
  reducers: {
    setDatasetMetadata(state, action) {
      state.datasetMetadata = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setDatasetMetadata, setLoading } = reviewSlice.actions;

export default reviewSlice.reducer;
