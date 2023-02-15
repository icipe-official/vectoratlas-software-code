import { createSlice } from '@reduxjs/toolkit';

export interface ReviewState {
  datasetMetadata: {
    UpdatedBy: string;
    UpdatedAt: string;
    ReviewedBy: string[];
    ReviewedAt: string[];
    ApprovedBy: string[];
    ApprovedAt: string[];
    status: string;
  };
  loading: boolean;
  downloading: boolean;
}

export const initialState: () => ReviewState = () => ({
  datasetMetadata: {
    UpdatedBy: '',
    UpdatedAt: '',
    ReviewedBy: [],
    ReviewedAt: [],
    ApprovedBy: [],
    ApprovedAt: [],
    status: '',
  },
  loading: false,
  downloading: false,
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
    setDownloading(state, action) {
      state.downloading = action.payload;
    },
  },
});

export const { setDatasetMetadata, setLoading, setDownloading } = reviewSlice.actions;

export default reviewSlice.reducer;
