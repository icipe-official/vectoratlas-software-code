import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { deleteDatasetAuthenticated } from '../../../api/api';
import { AppState } from '../../store';
import { setLoading } from '../reviewSlice';

export const deleteDataset = createAsyncThunk(
  'review/deleteDataset',
  async ({ datasetId }: { datasetId: string }, { getState, dispatch }) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setLoading(true));
      await deleteDatasetAuthenticated(token, datasetId);
      toast.success('Dataset deleted.');
      dispatch(setLoading(false));
    } catch (e: any) {
      const status = e?.response?.status;
      toast.error(
        `Failed to delete dataset${
          status ? ` (HTTP ${status})` : ''
        }. Please try again.`
      );
      dispatch(setLoading(false));
      throw e; // let callers (.unwrap()) see the failure
    }
  }
);
