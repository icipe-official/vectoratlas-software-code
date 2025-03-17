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
      author,
      description,
      affiliated_institution,
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
      author: String;
      description: String;
      affiliated_institution: String;
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
      }

      dispatch(uploadLoading(true));
      // Call the API with the matched parameters
      const result = await postDatasetFileAuthenticated(
        dataFile, // The file to upload
        token, // The authorization token
        title,
        author,
        description, // Matching 'desc' to 'description'
        affiliated_institution,
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
          'Data uploaded successfully! Your data will be sent for review and you will hear back from us soon...'
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
    return false;
  }
);
