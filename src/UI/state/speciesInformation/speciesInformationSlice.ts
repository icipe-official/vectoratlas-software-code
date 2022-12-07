import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { SpeciesInformation } from '../state.types';
import { getAllSpecies } from './actions/upsertSpeciesInfo.action';
import { speciesDict } from './utils/speciesDict';

export interface SpeciesInformationState {
  currentInfoForEditing: SpeciesInformation | null;
  currentInfoDetails: string | null;
  speciesDict: {
    items: SpeciesItems[];
    total: number;
  };
  speciesInfoStatus: string;
  speciesListOptions: {
    page: number;
    rowsPerPage: number;
    orderBy: string;
    order: 'asc' | 'desc';
    startId: number | null;
    endId: number | null;
    textFilter: string;
  };
}

export interface SpeciesItems {
  [index: string]: any;
  id: string;
  name: string;
  shortDescription: string;
  description?: string;
  fullDetailsLoaded?: boolean;
  speciesImage?: string;
}

export const initialState: () => SpeciesInformationState = () => ({
  currentInfoForEditing: null,
  currentInfoDetails: null,
  speciesDict: {
    items: [],
    total: 0,
  },
  speciesInfoStatus: '',
  speciesListOptions: {
    page: 0,
    rowsPerPage: 10,
    orderBy: 'num_id',
    order: 'asc',
    startId: 0,
    endId: null,
    textFilter: '',
  },
});

export const speciesInformationSlice = createSlice({
  name: 'speciesInformation',
  initialState: initialState(),
  reducers: {
    setCurrentInfoForEditing(state, action) {
      state.currentInfoForEditing = action.payload;
    },
    setCurrentInfoDetails(state, action) {
      state.currentInfoDetails = action.payload;
    },
    // getFullDetails(state, action) {
    //   state.speciesDict.items.find(
    //     (item: any) => item.id === action.payload
    //   ).fullDetailsLoaded = true;

    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSpecies.pending, (state) => {
        state.speciesInfoStatus = 'loading';
      })
      .addCase(getAllSpecies.rejected, (state, action) => {
        state.speciesInfoStatus = 'error';
      })
      .addCase(getAllSpecies.fulfilled, (state, action) => {
        state.speciesDict.items = speciesDict(
          action.payload.allSpeciesInformation
        );
        state.speciesDict.total = state.speciesDict.items.length;
        state.speciesInfoStatus = 'success';
      });
  },
});

export const {
  setCurrentInfoForEditing,
  setCurrentInfoDetails,
  // getFullDetails,
} = speciesInformationSlice.actions;

export default speciesInformationSlice.reducer;
