import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchGraphQlDataAuthenticated, postModelFileAuthenticated } from '../../../api/api';
import { triggerModelTransform } from '../../../api/queries';
import { sleep } from '../../../components/map/utils/map.utils';
import { AppState } from '../../store';
import { uploadLoading } from '../uploadSlice';

export const uploadModel = createAsyncThunk(
  'upload/uploadModel',
  async ({displayName, maxValue}: {displayName: String, maxValue: String}, { getState, dispatch }) => {
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
        const token = (getState() as AppState).auth.token;
        let uploadStatus = (await fetchGraphQlDataAuthenticated(
          triggerModelTransform(displayName, Number(maxValue), result),
          token
        )).data.postProcessModel.status;
        console.log(uploadStatus)
        while (uploadStatus === "RUNNING") {
          uploadStatus = (await fetchGraphQlDataAuthenticated(
            triggerModelTransform(displayName, Number(maxValue), result),
            token
          )).data.postProcessModel.status;
          console.log(uploadStatus)
          sleep(200);
        }

        if (uploadStatus === "ERROR") {
          toast.error('Unknown error in uploading model. Please try again.');
          dispatch(uploadLoading(false));
          return false;
        }

        toast.success('Model uploaded.');
        dispatch(uploadLoading(false));
        return true;
      }
    }
  }
);
