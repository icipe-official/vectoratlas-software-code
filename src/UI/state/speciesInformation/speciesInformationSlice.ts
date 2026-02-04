import { createSlice } from '@reduxjs/toolkit';
import { FilterSort, SpeciesInformation } from '../state.types';
import { getAllSpecies } from './actions/getAllSpecies';

export interface SpeciesInformationState {
  currentInfoForEditing: SpeciesInformation | null;
  loading: boolean;
  currentInfoDetails: SpeciesInformation | null;
  speciesDict: {
    items: SpeciesInformation[];
    total: number;
  };
  speciesInfoStatus: string;
  speciesListOptions: FilterSort;
}

export const initialState: () => SpeciesInformationState = () => ({
  currentInfoForEditing: null,
  loading: false,
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
    speciesInfoLoading(state, action) {
      state.loading = action.payload;
    },
    setCurrentInfoDetails(state, action) {
      state.currentInfoDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSpecies.pending, (state) => {
        state.loading = true; // ✅ Set loading to true
        state.speciesInfoStatus = 'loading';
      })
      .addCase(getAllSpecies.rejected, (state, action) => {
        state.loading = false; // ✅ Set loading to false on error
        state.speciesInfoStatus = 'error';
      })
      .addCase(getAllSpecies.fulfilled, (state, action) => {
        state.loading = false; // ✅ Set loading to false on success
        state.speciesDict.items = action.payload;
        state.speciesDict.total = state.speciesDict.items.length;
        state.speciesInfoStatus = 'success';
      });
  },
});

export const {
  setCurrentInfoForEditing,
  speciesInfoLoading,
  setCurrentInfoDetails,
} = speciesInformationSlice.actions;

export default speciesInformationSlice.reducer;
