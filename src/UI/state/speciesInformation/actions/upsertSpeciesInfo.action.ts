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
    // Not encoded — never was on the way in either. Base64 image data
    // must pass through untouched.
    speciesImage: speciesInformation.speciesImage,
    previewImage: speciesInformation.previewImage,
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
    // Not decoded — matches sanitiseSpeciesInformation above. Decoding
    // base64 was a no-op today but risked silently corrupting image
    // data on any future payload containing a literal "%" sequence.
    speciesImage: speciesInformation.speciesImage,
    previewImage: speciesInformation.previewImage || '',
    citations: speciesInformation.citations.map((citation) =>
      decodeURIComponent(citation)
    ),
  };
};

export const upsertSpeciesInformation = createAsyncThunk(
  'speciesInformation/upsert',
  async (
    speciesInformation: SpeciesInformation,
    { getState, dispatch, rejectWithValue }
  ) => {
    dispatch(speciesInfoLoading(true));
    try {
      const token = (getState() as AppState).auth.token;
      const newSpecies = await fetchGraphQlDataAuthenticated(
        upsertSpeciesInformationMutation(
          sanitiseSpeciesInformation(speciesInformation)
        ),
        token
      );

      if (newSpecies.errors?.length) {
        throw new Error(
          newSpecies.errors[0]?.message || 'GraphQL mutation returned errors'
        );
      }
      if (!newSpecies.data?.createEditSpeciesInformation) {
        throw new Error(
          'GraphQL mutation succeeded but returned no species information'
        );
      }

      if (speciesInformation.id) {
        toast.success(
          await getTranslation(
            'ReduxActions.SpeciesInformation.updateSuccess',
            { id: newSpecies.data.createEditSpeciesInformation.id }
          )
        );
      } else {
        toast.success(
          await getTranslation(
            'ReduxActions.SpeciesInformation.createSuccess',
            { id: newSpecies.data.createEditSpeciesInformation.id }
          )
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
      dispatch(speciesInfoLoading(false));
      return newSpecies.data.createEditSpeciesInformation;
    } catch (e) {
      console.error('upsertSpeciesInformation failed:', e);
      toast.error(
        await getTranslation(
          'ReduxActions.SpeciesInformation.errors.updateError'
        )
      );
      dispatch(speciesInfoLoading(false));
      return rejectWithValue(e instanceof Error ? e.message : String(e));
    }
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
        );
        dispatch(getAllSpecies());
      } else {
        toast.error(
          await getTranslation(
            'ReduxActions.SpeciesInformation.errors.deleteError',
            { id: id }
          )
        );
      }
    } catch (e) {
      toast.error(
        await getTranslation(
          'ReduxActions.SpeciesInformation.errors.deleteGeneralError'
        )
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
