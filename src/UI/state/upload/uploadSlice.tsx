import { createSlice } from '@reduxjs/toolkit';
import { getTemplateList } from './actions/downloadTemplate';

export interface UploadState {
  modelFile: File | null;
  dataFile: File | null;
  loading: boolean;
  templateList: string[];
  currentUploadedDatasetId?: string;
  currentUploadedDatasetTitle?: string;
}

export const initialState: UploadState = {
  modelFile: null,
  dataFile: null,
  loading: false,
  templateList: [],
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setModelFile(state, action) {
      state.modelFile = action.payload;
    },
    setDataFile(state, action) {
      state.dataFile = action.payload;
    },
    uploadLoading(state, action) {
      state.loading = action.payload;
    },
    setTemplateList(state, action) {
      state.templateList = action.payload;
    },
    setCurrentUploadedDatasetId(state, action) {
      state.currentUploadedDatasetId = action.payload;
    },
    setCurrentUploadedDatasetTitle(state, action) {
      state.currentUploadedDatasetTitle = action.payload;
    },
  },
});

export const {
  setModelFile,
  setDataFile,
  uploadLoading,
  setTemplateList,
  setCurrentUploadedDatasetId,
  setCurrentUploadedDatasetTitle,
} = uploadSlice.actions;

export default uploadSlice.reducer;
