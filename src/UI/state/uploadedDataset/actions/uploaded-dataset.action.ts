import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setCurrentUploadedDataset,
  setIsDatasetValid,
  setLoading,
  setIsProcessingAction,
  setUploadedDatasets,
  setValidationErrors,
} from '../uploadedDatasetSlice';
import {
  fetchGraphQlData,
  fetchGraphQlDataAuthenticated,
  approveUploadedDatasetAuthenticated,
  assignPrimaryReviewersAuthenticated,
  assignTertiaryReviewersAuthenticated,
  fetchUploadedDatasetLogsByDatasetAuthenticated,
  rejectUploadedDatasetAuthenticated,
  reviewUploadedDatasetAuthenticated,
  completePrimaryReviewedUploadedDatasetAuthenticated,
  completeTertiaryReviewedUploadedDatasetAuthenticated,
  adhocCommunicationUploadedDatasetAuthenticated,
  validateUploadedDatasetAuthenticated,
  adhocValidateUploadedDatasetAuthenticated,
  requestDatasetReuploadAuthenticated,
  reuploadDatasetAuthenticated,
  downloadDataset,
  deleteUploadedDatasetAuthenticated,
  validateUploadedDatasetAuthenticated_v2,
} from '../../../api/api';
import { toast } from 'react-toastify';
import * as logger from '../../../utils/logger';
import {
  getAllUploadedDatasets,
  getUploadedDatasetsByUploader,
  uploadedDatasetById,
} from '../../../api/queries';
import { AppState } from '../../store';
import { DatasetFileType, RolesEnum, UploadedDataset } from '../../state.types';
import { getTranslation } from '../../../utils/localization';
// import { jobStarted } from '../ingestJobSlice';

const sanitiseDataset = (uploadedDataset: UploadedDataset): UploadedDataset => {
  return {
    ...uploadedDataset,
    title: encodeURIComponent(uploadedDataset.title),
    description: encodeURIComponent(uploadedDataset.description),
  };
};

const unsanitiseDataset = (
  uploadedDataset: UploadedDataset
): UploadedDataset => {
  return {
    ...uploadedDataset,
    title: decodeURIComponent(uploadedDataset.title),
    description: decodeURIComponent(uploadedDataset.description),
  };
};

export const getUploadedDataset = createAsyncThunk(
  'uploadedDataset/getUploadedDataset',
  async (id: string, { getState, dispatch }) => {
    dispatch(setLoading(true));
    try {
      const msg = await getTranslation(
        'ReduxActions.UploadedDataset.errors.completePrimaryReviewError'
      );
      const token = (getState() as AppState).auth.token;
      let res = await fetchGraphQlDataAuthenticated(
        uploadedDatasetById(id),
        token
      );
      dispatch(setCurrentUploadedDataset(res.data.uploadedDatasetById));
    } catch (e) {
      logger.error(e);
      toast.error(
        await getTranslation(
          'ReduxActions.UploadedDataset.errors.loadDatasetError'
        )
        //'Unable to get uploaded datasets'
      );
    }
    dispatch(setLoading(false));
  }
);

export const getUploadedDatasets = createAsyncThunk(
  'uploadedDataset/getAll',
  async (_, { getState, dispatch }) => {
    dispatch(setLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      const roles = (getState() as AppState).auth.roles;
      const user = (getState() as AppState).auth.id;
      const internalRoles = [
        RolesEnum.ADMIN.toString(),
        RolesEnum.REVIEWER.toString(),
        RolesEnum.REVIEWER_MANAGER.toString(),
      ];
      const isInternalUser = roles.some((el) =>
        internalRoles.includes(el.toString())
      );
      let res = await fetchGraphQlDataAuthenticated(
        isInternalUser
          ? getAllUploadedDatasets()
          : getUploadedDatasetsByUploader(user),
        token
      );
      if (isInternalUser) {
        dispatch(
          setUploadedDatasets(
            res.data.allUploadedDatasets?.map(unsanitiseDataset)
          )
        );
      } else {
        dispatch(
          setUploadedDatasets(
            res.data.uploadedDatasetsByUploader?.map(unsanitiseDataset)
          )
        );
      }
    } catch (e) {
      logger.error(e);
      toast.error(
        await getTranslation(
          'ReduxActions.UploadedDataset.errors.loadDatasetsError'
        )
        //'Unable to get uploaded datasets'
      );
    }
    dispatch(setLoading(false));
  }
);

export const approveUploadedDataset = createAsyncThunk(
  'uploadedDataset/approveUploadedDataset',
  async (
    { datasetId, comments }: { datasetId: string; comments: string },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setIsProcessingAction(true));
      dispatch(setValidationErrors({}));
      dispatch(setIsDatasetValid(undefined));
      const res = await approveUploadedDatasetAuthenticated(
        token,
        datasetId,
        comments
      );

      if (res.data.success) {
        toast.success(
          await getTranslation('ReduxActions.UploadedDataset.approved')
        );
        dispatch(getUploadedDataset(datasetId));
        dispatch(getUploadedDatasets());
        dispatch(setIsProcessingAction(false));
        dispatch(setIsDatasetValid(true));
      } else {
        dispatch(setIsProcessingAction(false));
        dispatch(setIsDatasetValid(false));
        if (Object.keys(res.data).includes('data')) {
          dispatch(setValidationErrors(res.data.data.errors));
        } else {
          dispatch(setValidationErrors(res.data?.error));
        }
        toast.error(
          res.data.error //'Something went wrong with dataset approval. Please try again'
        );
      }
    } catch (e) {
      dispatch(setIsDatasetValid(undefined));
      dispatch(
        setValidationErrors({
          error: 'Something went wrong with dataset approval. Please try again',
        })
      );
      dispatch(setIsProcessingAction(false));
      toast.error(
        await getTranslation(
          'ReduxActions.UploadedDataset.errors.approveFailure'
        )
        //'Something went wrong with dataset approval. Please try again'
      );
    }
  }
);

export const rejectUploadedDataset = createAsyncThunk(
  'uploadedDataset/rejectUploadedDataset',
  async (
    { datasetId, comments }: { datasetId: string; comments: string },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setIsProcessingAction(true));
      await rejectUploadedDatasetAuthenticated(token, datasetId, comments);
      toast.success(
        await getTranslation('ReduxActions.UploadedDataset.rejected')
        // 'Dataset rejected'
      );
      dispatch(getUploadedDataset(datasetId));
      dispatch(getUploadedDatasets());
      dispatch(setIsProcessingAction(false));
    } catch (e) {
      toast.error(
        // 'Something went wrong with rejecting dataset. Please try again'
        await getTranslation(
          'ReduxActions.UploadedDataset.errors.rejectFailure'
        )
      );
      dispatch(setIsProcessingAction(false));
    }
  }
);

export const reviewUploadedDataset = createAsyncThunk(
  'uploadedDataset/reviewUploadedDataset',
  async (
    { datasetId, comments }: { datasetId: string; comments: string },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setIsProcessingAction(true));
      await reviewUploadedDatasetAuthenticated(token, datasetId, comments);
      toast.success(
        await getTranslation('ReduxActions.UploadedDataset.reviewed')
        // 'Dataset reviewed'
      );
      dispatch(getUploadedDataset(datasetId));
      dispatch(getUploadedDatasets());
      dispatch(setIsProcessingAction(false));
    } catch (error) {
      toast.error(
        await getTranslation(
          'ReduxActions.UploadedDataset.errors.reviewFailure'
        )
        // ' Something went wrong when reviewing dataset. Please try again'
      );
      dispatch(setIsProcessingAction(false));
    }
  }
);

export const assignPrimaryReviewers = createAsyncThunk(
  'uploadedDataset/assignPrimaryReviewers',
  async (
    {
      datasetId,
      comments,
      assignees,
    }: { datasetId: string; comments: string; assignees: string[] },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setIsProcessingAction(true));
      const res = await assignPrimaryReviewersAuthenticated(
        token,
        datasetId,
        assignees,
        comments
      );
      toast.success(
        await getTranslation(
          'ReduxActions.UploadedDataset.primaryReviewersAssigned'
        )
        //'Primary reviewers assigned.'
      );
      dispatch(getUploadedDataset(datasetId));
      dispatch(getUploadedDatasets());
      dispatch(setIsProcessingAction(false));
    } catch (e) {
      toast.error(
        await getTranslation(
          'ReduxActions.UploadedDataset.errors.assignPrimaryReviewersFailure'
        )
        //'Something went wrong with assigning primary reviewers. Please try again'
      );
      dispatch(setIsProcessingAction(false));
    }
  }
);

export const assignTertiaryReviewers = createAsyncThunk(
  'uploadedDataset/assignTertiaryReviewers',
  async (
    {
      datasetId,
      comments,
      assignees,
      isReassignment,
    }: {
      datasetId: string;
      comments: string;
      assignees: string[];
      isReassignment: boolean;
    },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setIsProcessingAction(true));
      await assignTertiaryReviewersAuthenticated(
        token,
        datasetId,
        assignees,
        isReassignment,
        comments
      );
      toast.success(
        await getTranslation(
          'ReduxActions.UploadedDataset.tertiaryReviewersAssigned'
        )
        //'Tertiary reviewers assigned.'
      );
      dispatch(getUploadedDataset(datasetId));
      dispatch(getUploadedDatasets());
      dispatch(setIsProcessingAction(false));
    } catch (e) {
      toast.error(
        await getTranslation(
          'ReduxActions.UploadedDataset.errors.assignTertiaryReviewersFailure'
        )
        //'Something went wrong with assigning tertiary reviewers. Please try again'
      );
      dispatch(setIsProcessingAction(false));
    }
  }
);

export const completePrimaryReview = createAsyncThunk(
  'upload/completePrimaryReview',
  async (
    {
      datasetId,
      files,
      comments,
    }: {
      datasetId: string;
      files?: File | File[];
      comments?: string;
    },
    { getState, dispatch }
  ) => {
    try {
      //const dataFile = files; // (getState() as AppState).upload.dataFile;
      const token = (getState() as AppState).auth.token as string;
      if (!files) {
        toast.error(
          //'No file uploaded. Please choose a file and try again.'
          await getTranslation(
            'ReduxActions.UploadedDataset.errors.missingFile'
          )
        );
      } else {
        dispatch(setIsProcessingAction(true));
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
          dispatch(setIsProcessingAction(false));
          toast.error(
            //'Validation error(s) found with uploaded data - Please check the validation console'
            await getTranslation(
              'ReduxActions.UploadedDataset.errors.validationErrors'
            )
          );
        } else {
          const result =
            await completePrimaryReviewedUploadedDatasetAuthenticated(
              files,
              token,
              datasetId,
              comments || 'Complete Primary Review'
            );
          if (result.data.errors) {
            toast.error(
              await getTranslation(
                'ReduxActions.UploadedDataset.errors.completePrimaryReviewError'
              )
              // 'Unknown error in uploading primary reviewed data. Please try again.'
            );
            dispatch(setIsProcessingAction(false));
            return false;
          } else {
            toast.success(
              await getTranslation('ReduxActions.UploadedDataset.uploadSuccess')
              //'Data uploaded successfully!'
            );
            dispatch(getUploadedDataset(datasetId));
            dispatch(getUploadedDatasets());
            dispatch(setIsProcessingAction(false));
            return true;
          }
        }
      }
    } catch (e: any) {
      if (e.response.data.message) {
        logger.error(e.response.data.message);
        console.log(e.response.data.message);
      }
      toast.error(
        await getTranslation('ReduxActions.UploadedDataset.errors.uploadError')
        //'Unknown error in uploading dataset. Please try again.'
      );
      dispatch(setIsProcessingAction(false));
    }
  }
);

export const completeTertiaryReview = createAsyncThunk(
  'upload/completeTertiaryReview',
  async (
    {
      datasetId,
      files,
      comments,
    }: {
      datasetId: string;
      files?: File | File[];
      comments?: string;
    },
    { getState, dispatch }
  ) => {
    try {
      // const dataFile = uploadedFile; // (getState() as AppState).upload.dataFile;
      const token = (getState() as AppState).auth.token || '';
      if (!files) {
        toast.error(
          await getTranslation(
            'ReduxActions.UploadedDataset.errors.missingFile'
          )
          //'No file uploaded. Please choose a file and try again.'
        );
      } else {
        dispatch(setIsProcessingAction(true));
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
          dispatch(setIsProcessingAction(false));
          toast.error(
            await getTranslation(
              'ReduxActions.UploadedDataset.errors.validationErrors'
            )
            //'Validation error(s) found with uploaded data - Please check the validation console'
          );
        } else {
          const result =
            await completeTertiaryReviewedUploadedDatasetAuthenticated(
              files,
              token.toString(),
              datasetId,
              comments || 'Complete Tertiary Review'
            );
          if (result.data.errors) {
            toast.error(
              await getTranslation(
                'ReduxActions.UploadedDataset.errors.completePrimaryReviewError'
              )
              // 'Unknown error in completing tertiary review. Please try again.'
            );
            dispatch(setIsProcessingAction(false));
            return false;
          } else {
            toast.success(
              await getTranslation('ReduxActions.UploadedDataset.uploadSuccess')
              //'Data uploaded successfully!'
            );
            dispatch(getUploadedDataset(datasetId));
            dispatch(getUploadedDatasets());
            dispatch(setIsProcessingAction(false));
            return true;
          }
        }
      }
    } catch (e: any) {
      if (e.response.data.message) {
        logger.error(e.response.data.message);
        console.log(e.response.data.message);
      }
      toast.error(
        await getTranslation('ReduxActions.UploadedDataset.errors.uploadError')
        //'Unknown error in uploading dataset. Please try again.'
      );
      dispatch(setIsProcessingAction(false));
    }
  }
);

export const adhocCommunication = createAsyncThunk(
  'uploadedDataset/adhocCommunication',
  async (
    {
      datasetId,
      message,
      recipients,
      files,
    }: {
      datasetId: string;
      message: string;
      recipients: string[];
      files?: File | File[];
    },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setIsProcessingAction(true));
      await adhocCommunicationUploadedDatasetAuthenticated(
        token,
        datasetId,
        message,
        recipients,
        files
      );
      toast.success(
        await getTranslation(
          'ReduxActions.UploadedDataset.communicationSuccess'
        )
        //'Communication sent.'
      );
      dispatch(setIsProcessingAction(false));
      dispatch(getUploadedDataset(datasetId));
    } catch (e) {
      toast.error(
        await getTranslation(
          'ReduxActions.UploadedDataset.errors.communicationError'
        )
        //'Something went wrong when sending the communication. Please try again'
      );
      dispatch(setIsProcessingAction(false));
    }
  }
);

/**
 * validate dataset that has gone through tertiary review
 */
export const validateDataset = createAsyncThunk(
  'uploadedDataset/validateDataset',
  async (
    {
      datasetId,
    }: {
      datasetId?: string;
    },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token as string;
      dispatch(setIsProcessingAction(true));
      dispatch(setValidationErrors({}));
      dispatch(setIsDatasetValid(undefined));
      const res = await validateUploadedDatasetAuthenticated(
        token,
        datasetId || ''
      );
      if (!res?.data.valid_data) {
        dispatch(setValidationErrors(res?.data.errors));
        dispatch(setIsDatasetValid(false));
      } else {
        if (datasetId) {
          dispatch(getUploadedDataset(datasetId));
        }
        dispatch(setIsDatasetValid(true));
      }
      dispatch(setIsProcessingAction(false));
      return res;
    } catch (e) {
      toast.error(
        await getTranslation(
          'ReduxActions.UploadedDataset.errors.validateDatasetError'
        )
        //'Something went wrong when validating dataset. Please try again'
      );
      dispatch(setIsProcessingAction(false));
    }
  }
);

/**
 * validate dataset that has gone through tertiary review in async mode
 */
export const validateDataset_v2 = createAsyncThunk(
  'uploadedDataset/validateDataset_v2',
  async (
    {
      datasetId,
    }: {
      datasetId?: string;
    },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token as string;
      dispatch(setIsProcessingAction(true));
      dispatch(setValidationErrors({}));
      dispatch(setIsDatasetValid(undefined));
      const res = await validateUploadedDatasetAuthenticated_v2(
        token,
        datasetId || '',
        dispatch
      );
      // dispatch(jobStarted(res?.task_id));
      // connect(res?.task_id);

      if (!res?.data.valid_data) {
        dispatch(setValidationErrors(res?.data?.errors));
        dispatch(setIsDatasetValid(false));
      } else {
        if (datasetId) {
          dispatch(getUploadedDataset(datasetId));
        }
        dispatch(setIsDatasetValid(true));
      }
      dispatch(setIsProcessingAction(false));
      return res;
    } catch (e) {
      toast.error(
        await getTranslation(
          'ReduxActions.UploadedDataset.errors.validateDatasetError'
        )
        //'Something went wrong when validating dataset. Please try again'
      );
      dispatch(setIsProcessingAction(false));
    }
  }
);

/**
 * validate adhoc dataset
 */
export const adhocValidateDataset = createAsyncThunk(
  'uploadedDataset/adhocValidateDataset',
  async (
    {
      files,
    }: {
      files?: File | File[];
    },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token as string;
      dispatch(setIsDatasetValid(undefined));
      dispatch(setIsProcessingAction(true));
      const res = await adhocValidateUploadedDatasetAuthenticated(
        files || [],
        token
      );
      if (!res.data.valid_data) {
        dispatch(setIsDatasetValid(false));
        dispatch(setValidationErrors(res.data.errors));
      } else {
        dispatch(setIsDatasetValid(true));
        dispatch(setValidationErrors({}));
      }
      dispatch(setIsProcessingAction(false));
      return res;
    } catch (e) {
      toast.error(
        await getTranslation(
          'ReduxActions.UploadedDataset.errors.validateDatasetError'
        )
        //'Something went wrong when validating dataset. Please try again'
      );
      dispatch(setIsProcessingAction(false));
    }
  }
);

export const getUploadedDatasetLogs = createAsyncThunk(
  'uploadedDataset/getLogs',
  async (
    { datasetId, comments }: { datasetId: string; comments: string },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token;
      dispatch(setLoading(true));
      await fetchUploadedDatasetLogsByDatasetAuthenticated(token, datasetId);
      dispatch(setLoading(false));
    } catch (e) {
      toast.error(
        await getTranslation(
          'ReduxActions.UploadedDataset.errors.datasetLogsLoadError'
        )
        //'Something went wrong when retrieved dataset logs. Please try again'
      );
      dispatch(setLoading(false));
    }
  }
);

export const requestDatasetReupload = createAsyncThunk(
  'uploadedDataset/requestDatasetReupload',
  async (
    { datasetId, comments }: { datasetId: string; comments: string },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token as string;
      dispatch(setIsProcessingAction(true));
      await requestDatasetReuploadAuthenticated(token, datasetId, comments);
      toast.success(
        await getTranslation(
          'ReduxActions.UploadedDataset.reuploadRequestSuccess'
        )
        //'Dataset re-upload requested'
      );
      dispatch(setIsProcessingAction(false));
      dispatch(getUploadedDataset(datasetId));
    } catch (e) {
      toast.error(
        await getTranslation(
          'ReduxActions.UploadedDataset.errors.reuploadRequestError'
        )
        //'Something went wrong with requesting dataset re-upload. Please try again'
      );
      dispatch(setIsProcessingAction(false));
    }
  }
);

export const reuploadDataset = createAsyncThunk(
  'uploadedDataset/reuploadDataset',
  async (
    {
      datasetId,
      files,
      comments,
    }: { datasetId: string; files?: File | File[]; comments: string },
    { getState, dispatch }
  ) => {
    try {
      const token = (getState() as AppState).auth.token as string;
      dispatch(setIsProcessingAction(true));
      await reuploadDatasetAuthenticated(
        token,
        datasetId,
        files || [],
        comments
      );
      toast.success(
        await getTranslation('ReduxActions.UploadedDataset.reuploadSuccess')
        //'Dataset re-uploaded'
      );
      dispatch(setIsProcessingAction(false));
      dispatch(getUploadedDataset(datasetId));
    } catch (e) {
      toast.error(
        await getTranslation(
          'ReduxActions.UploadedDataset.errors.reuploadError'
        )
        //'Something went wrong with dataset re-upload. Please try again'
      );
      dispatch(setIsProcessingAction(false));
    }
  }
);

export const downloadDatasetFile = createAsyncThunk(
  'upload/downloadDatasetFile',
  async ({
    fileType,
    datasetId,
  }: {
    fileType: DatasetFileType;
    datasetId: string;
  }) => {
    await downloadDataset(datasetId, fileType);
  }
);

export const deleteDataset = createAsyncThunk(
  'uploadedDataset/deleteDataset',
  async (id: string, { getState, dispatch }) => {
    dispatch(setLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      let res = await deleteUploadedDatasetAuthenticated(token, id);
      dispatch(setCurrentUploadedDataset(null));
      toast.success(
        await getTranslation('ReduxActions.UploadedDataset.deleteSuccess')
      );
    } catch (e) {
      logger.error(e);
      toast.error(
        await getTranslation('ReduxActions.UploadedDataset.errors.deleteError')
      );
    }
    dispatch(setLoading(false));
  }
);
