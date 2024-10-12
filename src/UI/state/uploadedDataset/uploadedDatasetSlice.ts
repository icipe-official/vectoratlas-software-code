import { createSlice } from '@reduxjs/toolkit';

export interface UploadedDatasetState {
  uploadedDatasetMetadata: {
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
  };
  loading: boolean;
  downloading: boolean;
  uploadedDatasets: [];
}

export const initialState: () => UploadedDatasetState = () => ({
  uploadedDatasetMetadata: {
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
  },
  loading: false,
  downloading: false,
  uploadedDatasets: [],
});

export const uploadedDatasetSlice = createSlice({
  name: 'uploadedDataset',
  initialState: initialState(),
  reducers: {
    setUploadedDatasetMetadata(state, action) {
      state.uploadedDatasetMetadata = action.payload;
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
  },
});

export const {
  setUploadedDatasetMetadata,
  setLoading,
  setDownloading,
  setUploadedDatasets,
} = uploadedDatasetSlice.actions;

export default uploadedDatasetSlice.reducer;
