import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  fetchGraphQlData,
  fetchGraphQlDataAuthenticated,
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
      toast.error('Unable to get DOIs');
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
      toast.error('Unable to get DOIs');
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
      toast.error('Unable to get DOIs');
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
    }: { id: string; comments: string; recipients?: [string] },
    { getState, dispatch }
  ) => {
    dispatch(doiLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      let res = await fetchGraphQlDataAuthenticated(
        approveDoi(id, comments, recipients),
        token
      );
    } catch (error) {
      logger.error(error);
      toast.error('Unable to approve DOIs');
    }
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
    }: { id: string; comments: string; recipients?: [string] },
    { getState, dispatch }
  ) => {
    dispatch(doiLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      let res = await fetchGraphQlDataAuthenticated(
        rejectDoi(id, comments, recipients),
        token
      );
    } catch (error) {
      logger.error(error);
      toast.error('Unable to approve DOIs');
    }
    dispatch(doiLoading(false));
  }
);
