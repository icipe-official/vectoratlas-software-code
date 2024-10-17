import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { AppState } from '../../store';
import { uploadLoading } from '../uploadSlice';
import { postDatasetFileAuthenticated } from '../../../api/api'; // Import the API function

export const uploadData = createAsyncThunk(
  'upload/uploadData',
  async (
    {
      dataType,
      dataSource,
      doi,
      desc, // Matching 'description' with 'desc'
      title,
      datasetloc, // Matching 'location' with 'datasetloc'
      region,
      dataFile,
    }: {
      dataType: string;
      dataSource: string;
      doi?: string;
      desc: string;
      title: string;
      datasetloc: string;
      region: string;
      dataFile: File;
    },
    { getState, dispatch }
  ) => {
    try {
      const state = getState() as AppState;
      const token = state.auth.token;

      if (!dataFile) {
        toast.error('No file uploaded. Please choose a file and try again.');
        return false; // Early return if no file is present
      }

      dispatch(uploadLoading(true));

      // Call the API with the matched parameters
      const result = await postDatasetFileAuthenticated(
        dataFile, // The file to upload
        token, // The authorization token
        dataType,
        dataSource,
        doi,
        desc, // Matching 'desc' to 'description'
        title,
        datasetloc, // Matching 'datasetloc' to 'location'
        region
      );

      // Handle the API response
      if (result.errors) {
        toast.error('Validation error(s) found in uploaded data.');
      } else {
        toast.success('Data uploaded successfully! Your data will be reviewed.');
        return true; // Optionally return true for success
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Unknown error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      dispatch(uploadLoading(false)); // Ensure loading state is reset
    }
  }
);
