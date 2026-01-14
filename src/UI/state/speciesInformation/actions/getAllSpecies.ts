import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGraphQlData } from '../../../api/api';
import { allSpecies } from '../../../api/queries';
import { SpeciesInformation } from '../../state.types';
import { unsanitiseSpeciesInformation } from './upsertSpeciesInfo.action';

export const getAllSpecies = createAsyncThunk(
  'speciesInformation/getAll',
  async () => {
    let res = await fetchGraphQlData(allSpecies());
    return res.data.allSpeciesInformation.map((species: SpeciesInformation) =>
      unsanitiseSpeciesInformation(species)
    );
  }
);
