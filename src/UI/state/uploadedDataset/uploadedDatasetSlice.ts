import { createSlice, PayloadAction, StoreEnhancer } from '@reduxjs/toolkit';

export interface UploadedDatasetLogState {
  action_type: string;
  action_date: Date;
  action_details: string;
  action_taker: string;
}

export interface UploadedDatasetState {
  currentUploadedDataset: {
    id: string;
    owner: string;
    creation: string;
    updater: string;
    modified: string;
    title: string;
    description: string;
    uploaded_file_name: string;
    uploaded_file_name_primary_reviewed: string;
    uploaded_file_name_tertiary_reviewed: string;
    converted_file_name: string;
    provided_doi: string;
    status: string;
    last_status_update_date: string;
    uploader_email: string;
    uploader_name: string;
    primary_reviewers: string[];
    tertiary_reviewers: string[];
    uploaded_dataset_log: UploadedDatasetLogState[];
  };
  loading: boolean;
  downloading: boolean;
  uploadedDatasets: [];
  isProcessingAction: boolean;
  validationErrors: {};
  isDatasetValid: boolean;
}

export const initialState: () => UploadedDatasetState = () => ({
  currentUploadedDataset: {
    id: '',
    owner: '',
    creation: '',
    updater: '',
    modified: '',
    title: '',
    description: '',
    uploaded_file_name: '',
    uploaded_file_name_primary_reviewed: '',
    uploaded_file_name_tertiary_reviewed: '',
    converted_file_name: '',
    provided_doi: '',
    status: '',
    last_status_update_date: '',
    uploader_email: '',
    uploader_name: '',
    primary_reviewers: [],
    tertiary_reviewers: [],
    uploaded_dataset_log: [],
  },
  loading: false,
  downloading: false,
  uploadedDatasets: [],
  isProcessingAction: false,
  validationErrors: {},
  isDatasetValid: false,
});

export const uploadedDatasetSlice = createSlice({
  name: 'uploadedDataset',
  initialState: initialState(),
  reducers: {
    setCurrentUploadedDataset(state, action) {
      state.currentUploadedDataset = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setDownloading(state, action: PayloadAction<boolean>) {
      state.downloading = action.payload;
    },
    setUploadedDatasets(state, action) {
      state.uploadedDatasets = action.payload;
    },
    setIsProcessingAction(state, action: PayloadAction<boolean>) {
      state.isProcessingAction = action.payload;
    },
    setValidationErrors(state, action: PayloadAction<object>) {
      state.validationErrors = action.payload;
    },
    setIsDatasetValid(state, action: PayloadAction<boolean>) {
      state.isDatasetValid = action.payload;
    },
    // setUploadedDatasetLogs(state, action) {
    //   state.currentUploadedDataset.logs = action.payload;
    // },
  },
});

export const {
  setCurrentUploadedDataset,
  setLoading,
  setIsProcessingAction,
  setDownloading,
  setUploadedDatasets,
  setValidationErrors,
  setIsDatasetValid,
  // setUploadedDatasetLogs,
} = uploadedDatasetSlice.actions;

export default uploadedDatasetSlice.reducer;
