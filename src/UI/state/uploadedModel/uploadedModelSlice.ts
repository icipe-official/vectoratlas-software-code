import { createSlice, PayloadAction, StoreEnhancer } from '@reduxjs/toolkit';

export interface DOIState {
  id: string;
  doi_id: string;
  doi_link: string;
}

export interface UploadedModelLogState {
  action_type: string;
  action_date: Date;
  action_details: string;
  action_taker: string;
}

export interface UploadedModel {
  id: string;
  owner: string;
  creation: string;
  updater: string;
  modified: string;
  title: string;
  author: string;
  description: string;
  affiliated_institution: string;
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
  is_reupload_requested: boolean;
  is_reuploaded: boolean;
  uploaded_model_log: UploadedModelLogState[];
  is_doi_requested: boolean;
  doi: DOIState | null;
  // model_type: string;
  is_validated: boolean;
  is_tertiary_review_reassigned: boolean;
  reassigned_tertiary_reviewers: string[];
}

export interface UploadedModelState {
  currentUploadedModel: UploadedModel;
  loading: boolean;
  downloading: boolean;
  uploadedModels: UploadedModel[];
  isProcessingAction: boolean;
  validationErrors: { [s: string]: string };
  isModelValid: boolean | undefined;
}

export const initialState: () => UploadedModelState = () => ({
  currentUploadedModel: {
    id: '',
    owner: '',
    creation: '',
    updater: '',
    modified: '',
    title: '',
    author: '',
    description: '',
    affiliated_institution: '',
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
    is_reupload_requested: false,
    is_reuploaded: false,
    uploaded_model_log: [],
    is_doi_requested: false,
    doi: null,
    dataset_type: '',
    is_validated: false,
    is_tertiary_review_reassigned: false,
    reassigned_tertiary_reviewers: [],
  },
  loading: false,
  downloading: false,
  uploadedModels: [],
  isProcessingAction: false,
  validationErrors: {},
  isModelValid: undefined,
});

export const uploadedModelSlice = createSlice({
  name: 'uploadedModel',
  initialState: initialState(),
  reducers: {
    setCurrentUploadedModel(state, action) {
      state.currentUploadedModel = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setDownloading(state, action: PayloadAction<boolean>) {
      state.downloading = action.payload;
    },
    setUploadedModels(state, action) {
      state.uploadedModels = action.payload;
    },
    setIsProcessingAction(state, action: PayloadAction<boolean>) {
      state.isProcessingAction = action.payload;
    },
    setValidationErrors(state, action: PayloadAction<any>) {
      if (typeof action.payload === 'string') {
        state.validationErrors = { error: action.payload };
      } else {
        state.validationErrors = action.payload;
      }
    },
    setIsModelValid(state, action: PayloadAction<boolean | undefined>) {
      state.isModelValid = action.payload;
    },
    // setUploadedModelLogs(state, action) {
    //   state.currentUploadedModel.logs = action.payload;
    // },
  },
});

export const {
  setCurrentUploadedModel,
  setLoading,
  setIsProcessingAction,
  setDownloading,
  setUploadedModels,
  setValidationErrors,
  setIsModelValid,
  // setUploadedModelLogs,
} = uploadedModelSlice.actions;

export default uploadedModelSlice.reducer;
