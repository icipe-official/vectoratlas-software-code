import { createSlice } from '@reduxjs/toolkit';
import { SpeciesInformation } from '../state.types';

export interface SpeciesInformationState {
  currentInfoForEditing: SpeciesInformation | null;
  loading: boolean;
}

export const initialState: () => SpeciesInformationState = () => ({
  currentInfoForEditing: null,
  loading: false,
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
  },
  extraReducers: () => {},
});

export const { setCurrentInfoForEditing, speciesInfoLoading } =
  speciesInformationSlice.actions;

export default speciesInformationSlice.reducer;
