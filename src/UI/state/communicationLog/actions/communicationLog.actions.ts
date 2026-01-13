import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  fetchGraphQlData,
  fetchGraphQlDataAuthenticated,
} from '../../../api/api';

import {
  getCommunicationLogById,
  getCommunicationLogs,
} from '../../../api/queries';

import { DOI } from '../../state.types';
import { AppState } from '../../store';

import {
  setCurrentCommunicationLog,
  communicationLogLoading,
  setCommunicationLogs,
} from '../communicationLogSlice';
import { toast } from 'react-toastify';
import * as logger from '../../../utils/logger';
import { getTranslation } from '../../../utils/localization';

export const getCommunicationLog = createAsyncThunk(
  'communicationLog/getById',
  async (id: string, { getState, dispatch }) => {
    dispatch(communicationLogLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      let res = await fetchGraphQlDataAuthenticated(
        getCommunicationLogById(id),
        token,
      );
      dispatch(setCurrentCommunicationLog(res.data.communicationLogById));
    } catch (error) {
      logger.error(error);
      toast.error(
        await getTranslation(
          'ReduxActions.Communication.errors.loadCommunicationError',
        ),
        //'Unable to get Communication Logs'
      );
    }
    dispatch(communicationLogLoading(false));
  },
);

export const getAllCommunicationLogs = createAsyncThunk(
  'communicationLog/getAll',
  async (_, { getState, dispatch }) => {
    dispatch(communicationLogLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      let res = await fetchGraphQlDataAuthenticated(
        getCommunicationLogs(),
        token,
      );
      dispatch(setCommunicationLogs(res.data.allCommunicationLogs));
    } catch (error) {
      logger.error(error);
      toast.error(
        await getTranslation(
          'ReduxActions.Communication.errors.loadCommunicationsError',
        ),
        //'Unable to get Communication Logs'
      );
    }
    dispatch(communicationLogLoading(false));
  },
);
