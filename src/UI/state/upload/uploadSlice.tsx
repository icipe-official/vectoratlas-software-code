import { createSlice } from '@reduxjs/toolkit';
import { act } from 'react-dom/test-utils';

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

export const groupByKey = (array: any[], key: string) => 
  array.reduce((hash, {[key]:value, ...rest}) => 
    ({...hash, [value]:( hash[value] || [] )
      .concat({...rest})} ),
      {}
  )

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
      console.log(action.payload)
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
