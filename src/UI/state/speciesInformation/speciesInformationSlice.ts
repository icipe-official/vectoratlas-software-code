import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { speciesList } from '../map/utils/countrySpeciesLists';
import { SpeciesInformation } from '../state.types';
import { getAllSpecies } from './actions/upsertSpeciesInfo.action';

export interface SpeciesInformationState {
  currentInfoForEditing: SpeciesInformation | null;
  speciesList: {
    items: SpeciesIdAndName[];
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

export interface SpeciesIdAndName {
  [index: string]: any;
  id: string;
  name: string;
  shortDescription: string;
}

export const initialState: () => SpeciesInformationState = () => ({
  currentInfoForEditing: null,
  speciesList: {
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
    changeSpeciesPage(state, action: PayloadAction<number>) {
      state.speciesListOptions.page = action.payload;
      console.log('changeSpeciesPage');
    },
    changeSpeciesRowsPerPage(state, action: PayloadAction<number>) {
      state.speciesListOptions.rowsPerPage = action.payload;
      console.log('changeSpeciesRowsPerPage');
    },
    changeSort(state, action: PayloadAction<string>) {
      const isAsc =
        state.speciesListOptions.orderBy === action.payload &&
        state.speciesListOptions.order === 'asc';
      state.speciesListOptions.order = isAsc ? 'desc' : 'asc';
      state.speciesListOptions.orderBy = action.payload;
      console.log(current(state.speciesListOptions));
    },
    changeFilterId(
      state,
      action: PayloadAction<{ startId: number | null; endId: number | null }>
    ) {
      state.speciesListOptions.startId = action.payload.startId;
      state.speciesListOptions.endId = action.payload.endId;
      console.log('changeFilterId');
    },
    changeFilterText(state, action: PayloadAction<string>) {
      state.speciesListOptions.textFilter = action.payload;
      console.log('changeFilterText');
    },
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
        state.speciesList.items = action.payload.allSpeciesInformation;
        state.speciesList.total = state.speciesList.items.length;
        state.speciesInfoStatus = 'success';
      });
  },
});

export const {
  setCurrentInfoForEditing,
  changeSpeciesPage,
  changeSpeciesRowsPerPage,
  changeSort,
  changeFilterId,
  changeFilterText,
} = speciesInformationSlice.actions;

export default speciesInformationSlice.reducer;
