import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  postDataFileAuthenticated,
  postDataFileValidated,
} from '../../../api/api';
import { AppState } from '../../store';
import { updateValidationErrors, uploadLoading } from '../uploadSlice';

export const uploadData = createAsyncThunk(
  'upload/uploadData',
  async (
    {
      datasetId,
      dataType,
      dataSource,
      doi,
      title,
      description,
      country,
      region,
      generateDoi,
    }: {
      datasetId?: String;
      dataType?: String;
      dataSource?: String;
      doi?: String;
      title: String;
      description: String;
      country: String;
      region: String;
      generateDoi: Boolean;
    },
    { getState, dispatch }
  ) => {
    try {
      const dataFile = (getState() as AppState).upload.dataFile;
      const token = (getState() as AppState).auth.token;
      if (!dataFile) {
        toast.error('No file uploaded. Please choose a file and try again.');
      } else {
        dispatch(uploadLoading(true));
        // disable validation as we are allowing users to upload their own data which is later cleaned
        // and formatted according to the VA template later
        /*
        const validate = await postDataFileValidated(
          dataFile,
          token,
          dataType,
          dataSource
        );
        */
        const validate: Array<any> = [];
        if (validate.length > 0) {
          dispatch(updateValidationErrors(validate));
          dispatch(uploadLoading(false));
          toast.error(
            'Validation error(s) found with uploaded data - Please check the validation console'
          );
        } else {
          const result = await postDataFileAuthenticated(
            dataFile,
            token,
            title,
            description,
            country,
            region,
            dataType,
            dataSource,
            datasetId,
            doi,
            generateDoi
          );
          if (result.errors) {
            toast.error('Unknown error in uploading data. Please try again.');
            dispatch(uploadLoading(false));
            return false;
          } else {
            toast.success(
              'Data uploaded! Your data will be sent for review and you will hear back from us soon...'
            );
            dispatch(uploadLoading(false));
            return true;
          }
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
