import { createSlice } from '@reduxjs/toolkit';

export interface UploadState {
  modelFile: File | null;
  loading: boolean;
}

export const initialState: () => UploadState = () => ({
  modelFile: null,
  loading: false,
});

export const uploadSlice = createSlice({
  name: 'upload',
  initialState: initialState(),
  reducers: {
    setModelFile(state, action) {
      state.modelFile = action.payload;
    },
    uploadLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setModelFile, uploadLoading } = uploadSlice.actions;

export default uploadSlice.reducer;
