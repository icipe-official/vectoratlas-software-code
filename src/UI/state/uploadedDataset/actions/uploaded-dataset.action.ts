import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setCurrentUploadedDataset,
  setLoading,
  setUploadedDatasets,
} from '../uploadedDatasetSlice';
import {
  approveUploadedDatasetAuthenticated,
  fetchGraphQlData,
  fetchGraphQlDataAuthenticated,
  fetchUploadedDatasetLogsByDatasetAuthenticated,
  rejectUploadedDatasetAuthenticated,
  reviewUploadedDatasetAuthenticated,
} from '../../../api/api';
import { toast } from 'react-toastify';
import * as logger from '../../../utils/logger';
import {
  getAllUploadedDatasets,
  uploadedDatasetById,
} from '../../../api/queries';
import { AppState } from '../../store';
import { UploadedDataset } from '../../state.types';

const sanitiseDataset = (uploadedDataset: UploadedDataset): UploadedDataset => {
  return {
    ...uploadedDataset,
    title: encodeURIComponent(uploadedDataset.title),
    description: encodeURIComponent(uploadedDataset.description),
  };
};

const unsanitiseDataset = (
  uploadedDataset: UploadedDataset
): UploadedDataset => {
  return {
    ...uploadedDataset,
    title: decodeURIComponent(uploadedDataset.title),
    description: decodeURIComponent(uploadedDataset.description),
  };
};

export const getUploadedDataset = createAsyncThunk(
  'uploadedDataset/getUploadedDataset',
  async (id: string, { dispatch }) => {
    dispatch(setLoading(true));
    let res = await fetchGraphQlData(uploadedDatasetById(id));

    dispatch(setCurrentUploadedDataset(res.data.uploadedDatasetById));
    dispatch(setLoading(false));
  }
);

export const getUploadedDatasets = createAsyncThunk(
  'uploadedDataset/getAll',
  async (_, { getState, dispatch }) => {
    dispatch(setLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      let res = await fetchGraphQlDataAuthenticated(
        getAllUploadedDatasets(),
        token
      );
      dispatch(
        setUploadedDatasets(res.data.allUploadedDatasets.map(unsanitiseDataset))
      );
    } catch (e) {
      logger.error(e);
      toast.error('Unable to get uploaded datasets');
    }

    dispatch(setLoading(false));
  }
);

export const approveUploadedDataset = createAsyncThunk(
  'uploadedDataset/approveUploadedDataset',
  async (
    { datasetId, comments }: { datasetId: string; comments: string },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setLoading(true));
      await approveUploadedDatasetAuthenticated(token, datasetId, comments);
      toast.success('Dataset approved.');
      dispatch(setLoading(false));
      dispatch(getUploadedDataset(datasetId));
    } catch (e) {
      toast.error(
        'Something went wrong with dataset approval. Please try again'
      );
      dispatch(setLoading(false));
    }
  }
);

export const rejectUploadedDataset = createAsyncThunk(
  'uploadedDataset/rejectUploadedDataset',
  async (
    { datasetId, comments }: { datasetId: string; comments: string },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setLoading(true));
      await rejectUploadedDatasetAuthenticated(token, datasetId, comments);
      toast.success('Dataset rejected');
      dispatch(setLoading(false));
      dispatch(getUploadedDataset(datasetId));
    } catch (e) {
      toast.error(
        'Something went wrong with rejecting dataset. Please try again'
      );
      dispatch(setLoading(false));
    }
  }
);

export const reviewUploadedDataset = createAsyncThunk(
  'uploadedDataset/reviewUploadedDataset',
  async (
    { datasetId, comments }: { datasetId: string; comments: string },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setLoading(true));
      await reviewUploadedDatasetAuthenticated(token, datasetId, comments);
      toast.success('Dataset reviewed');
      dispatch(setLoading(false));
      dispatch(getUploadedDataset(datasetId));
    } catch (error) {
      toast.error(
        ' Something went wrong when reviewing dataset. Please try again'
      );
      dispatch(setLoading(false));
    }
  }
);

export const getUploadedDatasetLogs = createAsyncThunk(
  'uploadedDataset/getLogs',
  async (
    { datasetId, comments }: { datasetId: string; comments: string },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setLoading(true));
      await fetchUploadedDatasetLogsByDatasetAuthenticated(token, datasetId);
      dispatch(setLoading(false));
    } catch (e) {
      toast.error(
        'Something went wrong when retrieved dataset logs. Please try again'
      );
      dispatch(setLoading(false));
    }
  }
);
