import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dataset } from '../state.types';

export interface DatasetState {
  currentDataset: Dataset | null;
  loading: boolean;
  datasetList: Dataset[]; // Optional: if you’ll show a list later
  error: string | null;
}

export const initialState: () => DatasetState = () => ({
  currentDataset: null,
  loading: false,
  datasetList: [],
  error: null,
});

export const datasetSlice = createSlice({
  name: 'dataset',
  initialState: initialState(),
  reducers: {
    setCurrentDataset(state, action: PayloadAction<Dataset | null>) {
      state.currentDataset = action.payload;
    },
    datasetLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setDatasetList(state, action: PayloadAction<Dataset[]>) {
      state.datasetList = action.payload;
    },
    datasetError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentDataset,
  datasetLoading,
  setDatasetList,
  datasetError,
} = datasetSlice.actions;

export default datasetSlice.reducer;
