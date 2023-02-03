import { createSlice } from '@reduxjs/toolkit';

export type ErrorRow = {
  row: number;
  data: {
    row: number;
    key: string;
    errorType: string;
    expectedType?: string;
    receivedType?: string;
  }[];
};

export interface UploadState {
  modelFile: File | null;
  dataFile: File | null;
  loading: boolean;
  validationErrors: ErrorRow[];
}

export const initialState: () => UploadState = () => ({
  modelFile: null,
  dataFile: null,
  loading: false,
  validationErrors: [],
});

export const groupByKey = (data: any[], key: string) : ErrorRow[] =>
  Object.values(
    data.reduce((res, item) => {
      const value = item[key];
      const existing = res[value] || { [key]: value, data: [] };
      return {
        ...res,
        [value]: {
          ...existing,
          data: [...existing.data, item],
        },
      };
    }, {})
  );

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
      state.validationErrors = groupByKey(action.payload, 'row');
    },
  },
});

export const {
  setModelFile,
  setDataFile,
  uploadLoading,
  updateValidationErrors,
} = uploadSlice.actions;

export default uploadSlice.reducer;
