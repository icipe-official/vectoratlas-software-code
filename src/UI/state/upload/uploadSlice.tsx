import { createSlice } from '@reduxjs/toolkit';

export interface UploadState {
  modelFile: File | null;
  dataFile: File | null;
  loading: boolean;
  validationErrors: String[]
}

export const initialState: () => UploadState = () => ({
  modelFile: null,
  dataFile: null,
  loading: false,
  validationErrors: []
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
    updateValidationErrors(state, action) {
      state.validationErrors = action.payload
    }
  },
});

export const { setModelFile, setDataFile, uploadLoading, updateValidationErrors } = uploadSlice.actions;

export default uploadSlice.reducer;
