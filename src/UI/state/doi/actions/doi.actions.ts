import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  approveDoiAuthenticated,
  fetchGraphQlData,
  fetchGraphQlDataAuthenticated,
  rejectDoiAuthenticated,
  XXX,
} from '../../../api/api';

import {
  getDoiById,
  getDOIsByStatus,
  approveDoi,
  rejectDoi,
  getDOIs,
} from '../../../api/queries';

import { DOI } from '../../state.types';
import { AppState } from '../../store';

import { setCurrentDoi, doiLoading, setDois } from '../doiSlice';
import { toast } from 'react-toastify';
import * as logger from '../../../utils/logger';
import { getTranslation } from '../../../utils/localization';

export const getDOI = createAsyncThunk(
  'doi/getById',
  async (id: string, { getState, dispatch }) => {
    dispatch(doiLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      let res = await fetchGraphQlDataAuthenticated(getDoiById(id), token);
      dispatch(setCurrentDoi(res.data?.doiById || null));
    } catch (error) {
      logger.error(error);
      toast.error(
        await getTranslation('ReduxActions.DOI.errors.loadDOIError')
        //'Unable to get DOIs'
      );
    }
    dispatch(doiLoading(false));
  }
);

export const getAllDoiByStatus = createAsyncThunk(
  'doi/getAllByStatus',
  async (status: string, { getState, dispatch }) => {
    dispatch(doiLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      let res = await fetchGraphQlDataAuthenticated(
        getDOIsByStatus(status),
        token
      );
      dispatch(setDois(res.data?.allDoisByStatus || []));
    } catch (error) {
      logger.error(error);
      toast.error(
        await getTranslation('ReduxActions.DOI.errors.loadDOIsError')
        //'Unable to get DOIs'
      );
    }
    dispatch(doiLoading(false));
  }
);

export const getAllDois = createAsyncThunk(
  'doi/getAll',
  async (_, { getState, dispatch }) => {
    dispatch(doiLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      let res = await fetchGraphQlDataAuthenticated(getDOIs(), token);
      dispatch(setDois(res.data?.allDois || []));
    } catch (error) {
      logger.error(error);
      toast.error(
        await getTranslation('ReduxActions.DOI.errors.loadDOIsError')
        //'Unable to get DOIs'
      );
    }
    dispatch(doiLoading(false));
  }
);

export const approveDoiById = createAsyncThunk(
  'doi/approve',
  async (
    {
      id,
      comments,
      recipients,
    }: { id: string; comments: string; recipients?: string[] },
    { getState, dispatch }
  ) => {
    dispatch(doiLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      const res = await approveDoiAuthenticated(
        token,
        id,
        comments || 'Approve DOI',
        recipients
      );
      const success = res && !Object.keys(res).includes('errors');
      if (success) {
        toast.success(
          await getTranslation('ReduxActions.DOI.approveSuccess')
          //'DOI approved'
        );
      } else {
        toast.error(
          await getTranslation('ReduxActions.DOI.errors.approveFailure')
          //`DOI was not approved. ${res.errors}`
        );
      }
    } catch (error) {
      logger.error(error);
      toast.error(
        await getTranslation('ReduxActions.DOI.errors.approveGeneralError')
        //'Unable to approve DOIs'
      );
    }
    // dispatch(setCurrentDoi(res.data?.doiById || null)(id));
    dispatch(doiLoading(false));
  }
);

export const rejectDoiById = createAsyncThunk(
  'doi/reject',
  async (
    {
      id,
      comments,
      recipients,
    }: { id: string; comments: string; recipients?: string[] },
    { getState, dispatch }
  ) => {
    dispatch(doiLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      const res = await rejectDoiAuthenticated(
        token,
        id,
        comments || 'Reject DOI',
        recipients
      );
      const success = res && !Object.keys(res).includes('errors');
      if (success) {
        toast.success(
          await getTranslation('ReduxActions.DOI.rejectSuccess')
          //'DOI rejected'
        );
      } else {
        toast.error(
          await getTranslation('ReduxActions.DOI.errors.rejectFailure')
          //`DOI was not rejected. ${res.errors}`
        );
      }
    } catch (error) {
      logger.error(error);
      toast.error(
        await getTranslation('ReduxActions.DOI.errors.rejectGeneralError')
        //'Unable to reject DOIs'
      );
    }
    dispatch(doiLoading(false));
  }
);
