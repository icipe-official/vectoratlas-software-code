import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchGraphQlData,
  fetchGraphQlDataAuthenticated,
} from '../../../api/api';
import {
  allSpecies,
  deleteSpeciesInformationMutation,
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
import { getAllSpecies } from './getAllSpecies';
import { getTranslation } from '../../../utils/localization';

const sanitiseSpeciesInformation = (
  speciesInformation: SpeciesInformation
): SpeciesInformation => {
  return {
    ...speciesInformation,
    name: encodeURIComponent(speciesInformation.name),
    shortDescription: encodeURIComponent(speciesInformation.shortDescription),
    description: encodeURIComponent(speciesInformation.description),
    citations: speciesInformation.citations.map((citation) =>
      encodeURIComponent(citation)
    ),
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
    citations: speciesInformation.citations.map((citation) =>
      decodeURIComponent(citation)
    ),
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
          await getTranslation(
            'ReduxActions.SpeciesInformation.updateSuccess',
            { id: newSpecies.data.createEditSpeciesInformation.id }
          )
          // 'Updated species information with id ' +
          //   newSpecies.data.createEditSpeciesInformation.id
        );
      } else {
        toast.success(
          await getTranslation(
            'ReduxActions.SpeciesInformation.createSuccess',
            { id: newSpecies.data.createEditSpeciesInformation.id }
          )
          // 'New species information created with id ' +
          //   newSpecies.data.createEditSpeciesInformation.id
        );
      }
      dispatch(
        setCurrentInfoForEditing({
          name: '',
          shortDescription: '',
          description: '',
          speciesImage: '',
          citations: [],
        })
      );
    } catch (e) {
      toast.error(
        await getTranslation(
          'ReduxActions.SpeciesInformation.errors.updateError'
        )
        //'Unable to update species information'
      );
    }
    dispatch(speciesInfoLoading(false));
  }
);

export const deleteSpeciesInformation = createAsyncThunk(
  'speciesInformation/delete',
  async (id: string, { getState, dispatch }) => {
    dispatch(speciesInfoLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      const response = await fetchGraphQlDataAuthenticated(
        deleteSpeciesInformationMutation(id),
        token
      );

      if (response.data.deleteSpeciesInformation) {
        toast.success(
          await getTranslation(
            'ReduxActions.SpeciesInformation.deleteSuccess',
            { id: id }
          )
          //`Deleted species information with id ${id}`
        );
        // Optionally refresh the species list or handle state cleanup
        dispatch(getAllSpecies());
      } else {
        toast.error(
          await getTranslation(
            'ReduxActions.SpeciesInformation.errors.deleteError',
            { id: id }
          )
          //`Failed to delete species information with id ${id}`
        );
      }
    } catch (e) {
      toast.error(
        await getTranslation(
          'ReduxActions.SpeciesInformation.errors.deleteGeneralError'
        )
        //'Unable to delete species information'
      );
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
