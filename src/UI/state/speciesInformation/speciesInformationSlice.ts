import { createSlice } from '@reduxjs/toolkit';
import { SpeciesInformation } from '../state.types';

export interface SpeciesInformationState {
  currentInfoForEditing: SpeciesInformation | null;
}

export const initialState: () => SpeciesInformationState = () => ({
  currentInfoForEditing: null,
});

export const speciesInformationSlice = createSlice({
  name: 'speciesInformation',
  initialState: initialState(),
  reducers: {
    setCurrentInfoForEditing(state, action) {
      state.currentInfoForEditing = action.payload;
    },
  },
  extraReducers: () => {},
});

export const { setCurrentInfoForEditing } = speciesInformationSlice.actions;

export default speciesInformationSlice.reducer;
