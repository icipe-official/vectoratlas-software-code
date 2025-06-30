import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setCurrentUploadedModel,
  setIsModelValid,
  setLoading,
  setIsProcessingAction,
  setUploadedModels,
  setValidationErrors,
} from '../uploadedModelSlice';
import {
  fetchGraphQlData,
  fetchGraphQlDataAuthenticated,
  assignPrimaryReviewersAuthenticated,
  assignTertiaryReviewersAuthenticated,
  downloadModel,
  adhocCommunicationUploadedModelAuthenticated,
  fetchUploadedModelLogsByModelAuthenticated,
  deleteUploadedModelAuthenticated,
} from '../../../api/api';
import { toast } from 'react-toastify';
import * as logger from '../../../utils/logger';
import {
  getAllUploadedModels,
  getUploadedModelsByUploader,
  uploadedModelById,
} from '../../../api/queries';
import { AppState } from '../../store';
import { ModelFileType, RolesEnum, UploadedModel } from '../../state.types';
import { getTranslation } from '../../../utils/localization';

const sanitiseModel = (uploadedModel: UploadedModel): UploadedModel => {
  return {
    ...uploadedModel,
    title: encodeURIComponent(uploadedModel.title),
    description: encodeURIComponent(uploadedModel.description),
  };
};

const unsanitiseModel = (uploadedModel: UploadedModel): UploadedModel => {
  return {
    ...uploadedModel,
    title: decodeURIComponent(uploadedModel.title),
    description: decodeURIComponent(uploadedModel.description),
  };
};

export const getUploadedModel = createAsyncThunk(
  'uploadedModel/getUploadedModel',
  async (id: string, { getState, dispatch }) => {
    dispatch(setLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      let res = await fetchGraphQlDataAuthenticated(
        uploadedModelById(id),
        token
      );
      dispatch(setCurrentUploadedModel(res.data.uploadedModelById));
    } catch (e) {
      logger.error(e);
      toast.error(
        await getTranslation('ReduxActions.UploadedModel.errors.loadModelError')
        //'Unable to get uploaded model'
      );
    }
    dispatch(setLoading(false));
  }
);

export const getUploadedModels = createAsyncThunk(
  'uploadedModel/getAll',
  async (_, { getState, dispatch }) => {
    dispatch(setLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      const roles = (getState() as AppState).auth.roles;
      const user = (getState() as AppState).auth.id;
      const internalRoles = [
        RolesEnum.ADMIN.toString(),
        RolesEnum.MODEL_MANAGER.toString(),
      ];
      const isInternalUser = roles.some((el) =>
        internalRoles.includes(el.toString())
      );
      let res = await fetchGraphQlDataAuthenticated(
        isInternalUser
          ? getAllUploadedModels()
          : getUploadedModelsByUploader(user),
        token
      );
      if (isInternalUser) {
        dispatch(
          setUploadedModels(res.data.allUploadedModels?.map(unsanitiseModel))
        );
      } else {
        dispatch(
          setUploadedModels(
            res.data.uploadedModelsByUploader?.map(unsanitiseModel)
          )
        );
      }
    } catch (e) {
      logger.error(e);
      toast.error(
        await getTranslation(
          'ReduxActions.UploadedModel.errors.loadModelsError'
        )
        //'Unable to get uploaded models'
      );
    }
    dispatch(setLoading(false));
  }
);

// export const approveUploadedModel = createAsyncThunk(
//   'uploadedModel/approveUploadedModel',
//   async (
//     { modelId, comments }: { modelId: string; comments: string },
//     { getState, dispatch }
//   ) => {
//     try {
//       const token = (getState() as AppState).auth.token;
//       dispatch(setIsProcessingAction(true));
//       dispatch(setValidationErrors({}));
//       dispatch(setIsModelValid(undefined));
//       const res = await approveUploadedModelAuthenticated(
//         token,
//         modelId,
//         comments
//       );

//       if (res.data.success) {
//         toast.success('Model approved.');
//         dispatch(getUploadedModel(modelId));
//         dispatch(getUploadedModels());
//         dispatch(setIsProcessingAction(false));
//         dispatch(setIsModelValid(true));
//       } else {
//         dispatch(setIsProcessingAction(false));
//         dispatch(setIsModelValid(false));
//         if (Object.keys(res.data).includes('data')) {
//           dispatch(setValidationErrors(res.data.data.errors));
//         } else {
//           dispatch(setValidationErrors(res.data?.error));
//         }
//         toast.error(
//           res.data.error //'Something went wrong with model approval. Please try again'
//         );
//       }
//     } catch (e) {
//       dispatch(setIsModelValid(undefined));
//       dispatch(
//         setValidationErrors({
//           error: 'Something went wrong with model approval. Please try again',
//         })
//       );
//       dispatch(setIsProcessingAction(false));
//       toast.error('Something went wrong with model approval. Please try again');
//     }
//   }
// );

export const deleteModel = createAsyncThunk(
  'uploadedModel/deleteModel',
  async (id: string, { getState, dispatch }) => {
    dispatch(setLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      let res = await deleteUploadedModelAuthenticated(token, id);
      dispatch(setCurrentUploadedModel(null));
      toast.success(
        await getTranslation('ReduxActions.UploadedModel.deleteSuccess')
      );
    } catch (e) {
      logger.error(e);
      toast.error(
        await getTranslation('ReduxActions.UploadedModel.errors.deleteError')
      );
    }
    dispatch(setLoading(false));
  }
);

export const adhocCommunication = createAsyncThunk(
  'uploadedModel/adhocCommunication',
  async (
    {
      modelId,
      message,
      recipients,
      files,
    }: {
      modelId: string;
      message: string;
      recipients: string[];
      files?: File | File[];
    },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setIsProcessingAction(true));
      await adhocCommunicationUploadedModelAuthenticated(
        token,
        modelId,
        message,
        recipients,
        files
      );
      toast.success(
        await getTranslation('ReduxActions.UploadedModel.communicationSuccess')
        //'Communication sent.'
      );
      dispatch(setIsProcessingAction(false));
      dispatch(getUploadedModel(modelId));
    } catch (e) {
      toast.error(
        //'Something went wrong when sending the communication. Please try again'
        await getTranslation(
          'ReduxActions.UploadedModel.errors.communicationError'
        )
      );
      dispatch(setIsProcessingAction(false));
    }
  }
);

export const getUploadedModelLogs = createAsyncThunk(
  'uploadedModel/getLogs',
  async (
    { modelId, comments }: { modelId: string; comments: string },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setLoading(true));
      await fetchUploadedModelLogsByModelAuthenticated(token, modelId);
      dispatch(setLoading(false));
    } catch (e) {
      toast.error(
        await getTranslation(
          'ReduxActions.UploadedModel.errors.modelLogsLoadError'
        )
        //'Something went wrong when retrieved model logs. Please try again'
      );
      dispatch(setLoading(false));
    }
  }
);

export const downloadModelFile = createAsyncThunk(
  'upload/downloadModelFile',
  async ({ modelId }: { fileType: ModelFileType; modelId: string }) => {
    await downloadModel(modelId);
  }
);
