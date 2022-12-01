import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchGraphQlData,
  fetchGraphQlDataAuthenticated,
} from '../../../api/api';
import {
  speciesInformationById,
  upsertSpeciesInformationMutation,
} from '../../../api/queries';
import { SpeciesInformation } from '../../state.types';
import { AppState } from '../../store';
import { setCurrentInfoForEditing } from '../speciesInformationSlice';

export const upsertSpeciesInformation = createAsyncThunk(
  'speciesInformation/upsert',
  async (speciesInformation: SpeciesInformation, { getState }) => {
    try {
      const token = (getState() as AppState).auth.token;
      await fetchGraphQlDataAuthenticated(
        upsertSpeciesInformationMutation(speciesInformation),
        token
      );
    } catch (e) {
      console.log(e);
    }
  }
);

export const getSpeciesInformation = createAsyncThunk(
  'speciesInformation/getWithId',
  async (id: string, { dispatch }) => {
    let res = await fetchGraphQlData(speciesInformationById(id));

    dispatch(setCurrentInfoForEditing(res.data.speciesInformationById));
  }
);
