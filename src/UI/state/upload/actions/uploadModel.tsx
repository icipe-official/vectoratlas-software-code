import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { postModelFileAuthenticated } from '../../../api/api';
import { AppState } from '../../store';
import { uploadLoading } from '../uploadSlice';

export const uploadModel = createAsyncThunk(
  'upload/uploadModel',
  async (_, { getState, dispatch }) => {
    const modelFile = (getState() as AppState).upload.modelFile;
    const token = (getState() as AppState).auth.token;
    if (!modelFile) {
      toast.error('No file uploaded. Please choose a file and try again.');
    } else {
      dispatch(uploadLoading(true));
      const result = await postModelFileAuthenticated(modelFile, token);
      if (result.errors) {
        toast.error('Unknown error in uploading model. Please try again.');
        dispatch(uploadLoading(false));
        return false;
      } else {
        toast.success('Model uploaded.');
        dispatch(uploadLoading(false));
        return true;
      }
    }
  }
);
