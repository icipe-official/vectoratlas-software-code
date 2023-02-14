import { createSlice } from '@reduxjs/toolkit';


export interface Dataset {
    UpdatedBy: string;
    UpdatedAt: string;
    ReviewedBy: string[];
    ReviewedAt: string[];
    ApprovedBy: string[];
    ApprovedAt: string[];
    status: string;
    dataset_id: string;

};

export interface ReviewState {
  dataset_list: Dataset[];
  review_dataset: Dataset;
  loading: boolean;
}


export const initialState:  () => ReviewState = () => ({
  dataset_list: [],
  review_dataset: {
    UpdatedBy: '',
    UpdatedAt: '',
    ReviewedBy: [],
    ReviewedAt: [],
    ApprovedBy: [],
    ApprovedAt: [],
    status: '',
    dataset_id: '',
  },
  loading: false,
});


export const reviewSlice = createSlice({
  name: 'review',
  initialState: initialState(),
  reducers: {
    setDatasetList(state, action) {
      state.dataset_list = action.payload;
    },
    setDatasetMetadata(state, action) {
      state.review_dataset = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setDatasetList, setDatasetMetadata, setLoading } = reviewSlice.actions;

export default reviewSlice.reducer;
