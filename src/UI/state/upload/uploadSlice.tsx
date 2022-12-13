import { createSlice } from '@reduxjs/toolkit';

export interface UploadState {
  modelFile: File | null,
}

export const initialState: () => UploadState = () => ({
  modelFile: null,
});

export const uploadSlice = createSlice({
  name: 'upload',
  initialState: initialState(),
  reducers: {
    setModelFile(state, action) {
      state.modelFile = action.payload;
    },
  },
});

export const {
  setModelFile,
} = uploadSlice.actions;

export default uploadSlice.reducer;
