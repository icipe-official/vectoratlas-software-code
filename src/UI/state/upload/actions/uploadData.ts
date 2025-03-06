import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { AppState } from '../../store';
import {
  setCurrentUploadedDatasetId,
  setCurrentUploadedDatasetTitle,
  uploadLoading,
} from '../uploadSlice';
import { postDatasetFileAuthenticated } from '../../../api/api'; // Import the API function

export const uploadData = createAsyncThunk(
  'upload/uploadData',
  async (
    {
      dataType,
      dataSource,
      doi,
      title,
      description,
      country,
      region,
      generateDoi,
      dataFile,
      isValidated,
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
      dataFile: File;
      isValidated: Boolean;
    },
    { getState, dispatch }
  ) => {
    try {
      const state = getState() as AppState;
      const token = state.auth.token;

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
        /*
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
        return false; // Early return if no file is present */
      }

      dispatch(uploadLoading(true));
      // Call the API with the matched parameters
      const result = await postDatasetFileAuthenticated(
        dataFile, // The file to upload
        token, // The authorization token
        title,
        description, // Matching 'desc' to 'description'
        country,
        region,
        dataType,
        dataSource,
        '',
        doi,
        generateDoi,
        isValidated
      );

      // Handle the API response
      if (result.errors) {
        toast.error('Validation error(s) found in uploaded data.');
      } else {
        dispatch(setCurrentUploadedDatasetId(result.id));
        dispatch(setCurrentUploadedDatasetTitle(result.title));
        toast.success(
          'Data uploaded successfully! Your data will be reviewed.'
        );
        return true; // Optionally return true for success
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'Unknown error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      dispatch(uploadLoading(false)); // Ensure loading state is reset
    }
  }
);
