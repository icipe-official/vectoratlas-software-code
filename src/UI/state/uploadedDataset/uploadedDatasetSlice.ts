import { createSlice } from '@reduxjs/toolkit';

export interface UploadedDatasetLogState {
  action_type: string;
  action_date: Date;
  action_details: string;
  action_taker: string;
}

export interface UploadedDatasetState {
  currentUploadedDataset: {
    owner: string;
    creation: string;
    updater: string;
    modified: string;
    title: string;
    description: string;
    uploaded_file_name: string;
    converted_file_name: string;
    provided_doi: string;
    status: string;
    last_status_update_date: string;
    uploader_email: string;
    uploader_name: string;
    assigned_reviewers: string;
    uploaded_dataset_log: UploadedDatasetLogState[];
  };
  loading: boolean;
  downloading: boolean;
  uploadedDatasets: [];
}

export const initialState: () => UploadedDatasetState = () => ({
  currentUploadedDataset: {
    owner: '',
    creation: '',
    updater: '',
    modified: '',
    title: '',
    description: '',
    uploaded_file_name: '',
    converted_file_name: '',
    provided_doi: '',
    status: '',
    last_status_update_date: '',
    uploader_email: '',
    uploader_name: '',
    assigned_reviewers: '',
    logs: [],
  },
  loading: false,
  downloading: false,
  uploadedDatasets: [],
});

export const uploadedDatasetSlice = createSlice({
  name: 'uploadedDataset',
  initialState: initialState(),
  reducers: {
    setCurrentUploadedDataset(state, action) {
      state.currentUploadedDataset = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setDownloading(state, action) {
      state.downloading = action.payload;
    },
    setUploadedDatasets(state, action) {
      state.uploadedDatasets = action.payload;
    },
    // setUploadedDatasetLogs(state, action) {
    //   state.currentUploadedDataset.logs = action.payload;
    // },
  },
});

export const {
  setCurrentUploadedDataset,
  setLoading,
  setDownloading,
  setUploadedDatasets,
  // setUploadedDatasetLogs,
} = uploadedDatasetSlice.actions;

export default uploadedDatasetSlice.reducer;
