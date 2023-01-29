import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { postDataFileAuthenticated } from '../../../api/api';
import { AppState } from '../../store';
import { uploadLoading } from '../uploadSlice';

export const uploadData = createAsyncThunk(
  'upload/uploadData',
  async (
    {
      datasetId,
      dataType,
      dataSource,
    }: { datasetId?: String; dataType: String; dataSource: String },
    { getState, dispatch }
  ) => {
    try {
      const dataFile = (getState() as AppState).upload.dataFile;
      const token = (getState() as AppState).auth.token;

      if (!dataFile) {
        toast.error('No file uploaded. Please choose a file and try again.');
      } else {
        dispatch(uploadLoading(true));
        const result = await postDataFileAuthenticated(
          dataFile,
          token,
          dataType,
          dataSource,
          datasetId
        );

        if (result.errors) {
          toast.error('Unknown error in uploading data. Please try again.');
          dispatch(uploadLoading(false));
          return false;
        } else {
          toast.success('Data uploaded.');
          dispatch(uploadLoading(false));
          return true;
        }
      }
    } catch (e: any) {
      if (e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error('Unknown error in uploading data. Please try again.');
      }
      dispatch(uploadLoading(false));
    }
  }
);
