import { createSlice } from '@reduxjs/toolkit';
import { getTemplateList } from './actions/downloadTemplate';

export interface UploadState {
  modelFile: File | null;
  dataFile: File | null;
  loading: boolean;
  templateList: string[];
}

export const initialState: () => UploadState = () => ({
  modelFile: null,
  dataFile: null,
  loading: false,
  templateList: [],
});

export const uploadSlice = createSlice({
  name: 'upload',
  initialState: initialState(),
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
  },
  extraReducers: (builder) => {
    builder.addCase(getTemplateList.fulfilled, (state, action) => {
      state.templateList = action.payload;
    });
  },
});

export const { setModelFile, setDataFile, uploadLoading } = uploadSlice.actions;

export default uploadSlice.reducer;
