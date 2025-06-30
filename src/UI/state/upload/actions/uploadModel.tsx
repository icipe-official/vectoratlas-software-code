import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  fetchGraphQlDataAuthenticated,
  postModelFileAuthenticated,
} from '../../../api/api';
import { triggerModelTransform } from '../../../api/queries';
import { sleep } from '../../../components/map/utils/map.utils';
import { AppState } from '../../store';
import { uploadLoading } from '../uploadSlice';
import { boolean } from 'yup';
import { getTranslation } from '../../../utils/localization';

export const uploadModel = createAsyncThunk(
  'upload/uploadModel',
  async (
    {
      displayName,
      maxValue,
      generateDoi,
      authors,
      institution,
      country,
      providedDoi,
      comments,
    }: {
      displayName: string;
      maxValue: string;
      generateDoi: boolean;
      authors?: string;
      institution?: string;
      country?: string;
      providedDoi?: string;
      comments?: string;
    },
    { getState, dispatch }
  ) => {
    const modelFile = (getState() as AppState).upload.modelFile;
    const token = (getState() as AppState).auth.token;
    if (!modelFile) {
      toast.error(
        await getTranslation('ReduxActions.UploadedModel.errors.missingFile')
        //'No file uploaded. Please choose a file and try again.'
      );
    } else {
      const maxSize = parseInt(
        process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE || '100000000'
      );
      if (modelFile.size > maxSize) {
        toast.error(
          await getTranslation(
            'ReduxActions.UploadedModel.errors.exceededFileSize',
            { maxSize: maxSize / 1000000 }
          )
          //`Maximum file size exceeded of ${maxSize / 1000000}MB.`
        );
        return false;
      }
      dispatch(uploadLoading(true));
      const result = await postModelFileAuthenticated(
        modelFile,
        token,
        displayName,
        maxValue,
        generateDoi,
        authors,
        institution,
        country,
        providedDoi,
        comments
      );
      if (result.errors) {
        toast.error(
          await getTranslation('ReduxActions.UploadedModel.errors.uploadError')
          //`Error in uploading model. Please try again. ${result.errors}`
        );
        dispatch(uploadLoading(false));
        return false;
      } else {
        toast.success(
          await getTranslation('ReduxActions.UploadedModel.uploadSuccess')
          //'Model uploaded, now transforming...'
        );
        const token = (getState() as AppState).auth.token;
        let uploadStatus = (
          await fetchGraphQlDataAuthenticated(
            // triggerModelTransform(displayName, Number(maxValue), result),
            triggerModelTransform(
              displayName,
              Number(maxValue),
              result.uploaded_file_name,
              result.id
            ),
            token
          )
        ).data.postProcessModel.status;
        while (uploadStatus === 'RUNNING') {
          uploadStatus = (
            await fetchGraphQlDataAuthenticated(
              //triggerModelTransform(displayName, Number(maxValue), result),
              triggerModelTransform(
                displayName,
                Number(maxValue),
                result.uploaded_file_name,
                result.id
              ),
              token
            )
          ).data.postProcessModel.status;
          sleep(2000);
        }

        if (uploadStatus === 'ERROR') {
          toast.error(
            await getTranslation(
              'ReduxActions.UploadedModel.errors.modelTransformError'
            )
            //'Unknown error in transforming model. Please try again.'
          );
          dispatch(uploadLoading(false));
          return false;
        }

        toast.success(
          await getTranslation('ReduxActions.UploadedModel.transformSuccess')
          //'Model uploaded and transformed.'
        );
        dispatch(uploadLoading(false));
        return true;
      }
    }
  }
);
