import { createSlice } from '@reduxjs/toolkit';
import { getTemplateList } from './actions/downloadTemplate';

export type ErrorRow = {
  row: number;
  data: {
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
  templateList: string[];
}

export const initialState: () => UploadState = () => ({
  modelFile: null,
  dataFile: null,
  loading: false,
  validationErrors: [],
  templateList: [],
});

const groupByRow = (array: any): any => {
  const errorGrouped = array.reduce(
    (accumulatorList: { row: any; data: any[] }[], error: { row: any }) => {
      const group = accumulatorList.find((g) => g.row === error.row);
      if (group) {
        group.data.push(error);
      } else {
        accumulatorList.push({ row: error.row, data: [error] });
      }
      delete error.row;
      return accumulatorList;
    },
    []
  );
  return errorGrouped;
};

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
      state.validationErrors = groupByRow(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTemplateList.fulfilled, (state, action) => {
      state.templateList = action.payload;
    });
  },
});

export const {
  setModelFile,
  setDataFile,
  uploadLoading,
  updateValidationErrors,
} = uploadSlice.actions;

export default uploadSlice.reducer;
