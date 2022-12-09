import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchGraphQlData,
  fetchGraphQlDataAuthenticated,
} from '../../../api/api';
import {
  allSpecies,
  speciesInformationById,
  upsertSpeciesInformationMutation,
} from '../../../api/queries';
import { SpeciesInformation } from '../../state.types';
import { AppState } from '../../store';
import {
  setCurrentInfoDetails,
  setCurrentInfoForEditing,
  speciesInfoLoading,
} from '../speciesInformationSlice';
import { toast } from 'react-toastify';

const sanitiseSpeciesInformation = (
  speciesInformation: SpeciesInformation
): SpeciesInformation => {
  return {
    ...speciesInformation,
    name: encodeURIComponent(speciesInformation.name),
    shortDescription: encodeURIComponent(speciesInformation.shortDescription),
    description: encodeURIComponent(speciesInformation.description),
  };
};

export const unsanitiseSpeciesInformation = (
  speciesInformation: SpeciesInformation
): SpeciesInformation => {
  return {
    ...speciesInformation,
    name: decodeURIComponent(speciesInformation.name),
    shortDescription: decodeURIComponent(speciesInformation.shortDescription),
    description: decodeURIComponent(speciesInformation.description),
  };
};

export const upsertSpeciesInformation = createAsyncThunk(
  'speciesInformation/upsert',
  async (speciesInformation: SpeciesInformation, { getState, dispatch }) => {
    dispatch(speciesInfoLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      const newSpecies = await fetchGraphQlDataAuthenticated(
        upsertSpeciesInformationMutation(
          sanitiseSpeciesInformation(speciesInformation)
        ),
        token
      );
      if (speciesInformation.id) {
        toast.success(
          'Updated species information with id ' +
            newSpecies.data.createEditSpeciesInformation.id
        );
      } else {
        toast.success(
          'New species information created with id ' +
            newSpecies.data.createEditSpeciesInformation.id
        );
      }
      dispatch(
        setCurrentInfoForEditing({
          name: '',
          shortDescription: '',
          description: '',
          speciesImage: '',
        })
      );
    } catch (e) {
      console.error(e);
      toast.error('Unable to update species information');
    }
    dispatch(speciesInfoLoading(false));
  }
);

export const getSpeciesInformation = createAsyncThunk(
  'speciesInformation/getWithId',
  async (id: string, { dispatch }) => {
    dispatch(speciesInfoLoading(true));
    let res = await fetchGraphQlData(speciesInformationById(id));

    dispatch(
      setCurrentInfoForEditing(
        unsanitiseSpeciesInformation(res.data.speciesInformationById)
      )
    );
    dispatch(
      setCurrentInfoDetails(
        unsanitiseSpeciesInformation(res.data.speciesInformationById)
      )
    );
    dispatch(speciesInfoLoading(false));
  }
);
