import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  datasetLoading,
  setDatasetList,
  setCurrentDataset,
  datasetError,
} from './approvalSlice';
import * as logger from '../../utils/logger';
import { toast } from 'react-toastify';
import { AppState } from '../store';
import { fetchGraphQlDataAuthenticated } from '../../api/api';
import { updateDatasetMutation, getAllDatasetsQuery } from '../../api/queries';
import { Dataset } from '../state.types';
import { getTranslation } from '../../utils/localization';

export const getAllDatasets = createAsyncThunk(
  'dataset/getAllDatasets',
  async (_, { getState, dispatch }) => {
    dispatch(datasetLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      const response = await fetchGraphQlDataAuthenticated(
        getAllDatasetsQuery(),
        token
      );
      dispatch(setDatasetList(response.data.datasets));
    } catch (error) {
      logger.error(error);
      toast.error(
        await getTranslation('ReduxActions.Approval.errors.loadDatasetsError')
        //'Unable to fetch datasets'
      );
    }
    dispatch(datasetLoading(false));
  }
);

export const updateDataset = createAsyncThunk(
  'dataset/updateDataset',
  async (
    { id, input }: { id: string; input: Partial<Dataset> },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      const response = await fetchGraphQlDataAuthenticated(
        updateDatasetMutation(id, input),
        token
      );
      dispatch(setCurrentDataset(response.data.updateDataset));
      toast.success(
        await getTranslation('ReduxActions.Approval.updateSuccess')
        //'Dataset updated successfully'
      );
    } catch (error) {
      logger.error(error);
      toast.error(
        await getTranslation('ReduxActions.Approval.errors.updateError')
        //'Unable to update dataset'
      );
    }
  }
);
