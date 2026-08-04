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

const safeDecodeURIComponent = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const sanitiseSpeciesInformation = (
  speciesInformation: SpeciesInformation
): SpeciesInformation => {
  return {
    ...speciesInformation,
    name: encodeURIComponent(speciesInformation.name),
    shortDescription: encodeURIComponent(speciesInformation.shortDescription),
    description: encodeURIComponent(speciesInformation.description),
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
    speciesImage: safeDecodeURIComponent(speciesInformation.speciesImage),
    previewImage: safeDecodeURIComponent(speciesInformation.previewImage || ''),
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

      // 🔧 ADDED: GraphQL can return HTTP 200 with an `errors` array, or with
      // `data` present but the specific field null. Axios won't throw for
      // either case, so we have to check explicitly.
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
      return newSpecies.data.createEditSpeciesInformation; // 🔧 ADDED: gives the component a fulfilled payload to check against
    } catch (e) {
      // 🔧 CHANGED: log the real error so it shows up in the browser console
      // instead of only ever seeing the generic toast.
      console.error('upsertSpeciesInformation failed:', e);
      toast.error(
        await getTranslation(
          'ReduxActions.SpeciesInformation.errors.updateError'
        )
      );
      dispatch(speciesInfoLoading(false));
      return rejectWithValue(e instanceof Error ? e.message : String(e)); // 🔧 ADDED
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
