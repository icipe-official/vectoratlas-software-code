import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  postDataFileAuthenticated,
} from '../../../api/api';
import { AppState } from '../../store';
import { uploadLoading } from '../uploadSlice';

export const uploadData = createAsyncThunk(
  'upload/uploadData',
  async (
    { datasetId, dataType }: { datasetId?: String; dataType: String; },
    { getState, dispatch }
  ) => {
    const dataFile = (getState() as AppState).upload.dataFile;
    const token = (getState() as AppState).auth.token;

    if (!dataFile) {
      toast.error('No file uploaded. Please choose a file and try again.');
    } else {
      dispatch(uploadLoading(true));
      const result = await postDataFileAuthenticated(dataFile, token, dataType === 'bionomics', datasetId);

      if (result.errors) {
        toast.error('Unknown error in uploading data. Please try again.');
        dispatch(uploadLoading(false));
        return false;
      } else {
        toast.success('Data uploaded.');
        return true;
      }
    }
  }
);
